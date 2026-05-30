/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GarmentConfig } from '../types';
import { Sparkles, RotateCw, ZoomIn, ZoomOut, Compass, Lightbulb, Play, Pause, User, Eye, EyeOff } from 'lucide-react';

interface FashionViewerProps {
  config: GarmentConfig;
  className?: string;
}

export default function FashionViewer({ config, className = '' }: FashionViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  
  // THREE Meshes refs for direct animation updating
  const upperMeshRef = useRef<THREE.Group | null>(null);
  const lowerMeshRef = useRef<THREE.Group | null>(null);
  const standMeshRef = useRef<THREE.Group | null>(null);
  const mannequinMeshRef = useRef<THREE.Group | null>(null);
  const glowLinesRef = useRef<THREE.LineSegments | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const energyRibbonsRef = useRef<THREE.Group | null>(null);

  // Material Refs
  const primaryMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const accentMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const glowMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Interaction State
  const [isRotating, setIsRotating] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activePresetLighting, setActivePresetLighting] = useState<'studio' | 'neon' | 'velvet' | 'sunlight'>('studio');
  const [isDragging, setIsDragging] = useState(false);
  const [customRotY, setCustomRotY] = useState(0);
  const [customRotX, setCustomRotX] = useState(0);
  const [showMannequin, setShowMannequin] = useState(true);

  const prevMousePosition = useRef({ x: 0, y: 0 });

  // 1. Procedural Texture Canvas Helper for garment fabrics (with support denim twill for Jeans and cozy cotton fleece for hoodies)
  const createProceduralTexture = (cfg: GarmentConfig): THREE.CanvasTexture => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Background Primary Color Fill
    ctx.fillStyle = cfg.primaryColor;
    ctx.fillRect(0, 0, size, size);

    // Apply specific pattern texture overlay
    ctx.strokeStyle = cfg.patternColor;
    ctx.fillStyle = cfg.patternColor;
    ctx.lineWidth = 4 * cfg.patternScale;

    // Apply special texture effects for Jeans / Hoodie if selected
    if (cfg.lowerType === 'jeans' || cfg.upperType === 'hoodie') {
      ctx.strokeStyle = '#ffffff';
      ctx.globalAlpha = 0.08;
      ctx.lineWidth = 1.5;
      const step = 8;
      for (let i = -size; i < size * 2; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + size, size);
        ctx.stroke();
      }
      ctx.strokeStyle = '#000000';
      ctx.globalAlpha = 0.12;
      for (let i = -size; i < size * 2; i += step) {
        ctx.beginPath();
        ctx.moveTo(i + size, 0);
        ctx.lineTo(i, size);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;
    }

    if (cfg.pattern === 'stripes') {
      const step = 40 / cfg.patternScale;
      for (let i = -size; i < size * 2; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + size, size);
        ctx.stroke();
      }
    } else if (cfg.pattern === 'grid') {
      const step = 50 / cfg.patternScale;
      for (let i = 0; i < size; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, size);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(size, i);
        ctx.stroke();
      }
    } else if (cfg.pattern === 'dots') {
      const step = 40 / cfg.patternScale;
      for (let x = 0; x < size; x += step) {
        for (let y = 0; y < size; y += step) {
          ctx.beginPath();
          ctx.arc(x + step / 2, y + step / 2, 4 * cfg.patternScale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (cfg.pattern === 'holographic') {
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, cfg.primaryColor);
      gradient.addColorStop(0.3, cfg.accentColor);
      gradient.addColorStop(0.5, '#7f5ec6');
      gradient.addColorStop(0.7, '#2cd8d5');
      gradient.addColorStop(1, cfg.primaryColor);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      for (let i = 0; i < size; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.bezierCurveTo(size / 3, i - 20, (size * 2) / 3, i + 20, size, i);
        ctx.stroke();
      }
    } else if (cfg.pattern === 'floral_brocade') {
      ctx.strokeStyle = cfg.patternColor;
      ctx.fillStyle = cfg.patternColor;
      ctx.globalAlpha = 0.55;
      const step = 80 / cfg.patternScale;
      for (let x = 0; x < size + step; x += step) {
        for (let y = 0; y < size + step; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, 12, 0, Math.PI);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x, y - 10, 6, Math.PI, 0);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.rect(x - 2, y - 2, 4, 4);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1.0;
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    return tex;
  };

  // 2. Fallback Face Graphic Helper when no file is uploaded
  const createDefaultFaceTexture = (): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, 256, 256);
    
    // Luxury dark glass head panel overlay
    ctx.fillStyle = 'rgba(20, 28, 22, 0.85)';
    ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = '#a4ffa2';
    ctx.lineWidth = 3;
    
    // Outer elegant shield contour
    ctx.beginPath();
    ctx.arc(128, 128, 110, 0, Math.PI * 2);
    ctx.stroke();

    // Creative holographic mannequin face guide grids
    ctx.strokeStyle = 'rgba(164, 255, 162, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(128, 20);
    ctx.lineTo(128, 236);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(20, 128);
    ctx.lineTo(236, 128);
    ctx.stroke();

    // Eyes
    ctx.strokeStyle = '#a4ffa2';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(92, 110, 12, 0.15 * Math.PI, 0.85 * Math.PI, true);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(164, 110, 12, 0.15 * Math.PI, 0.85 * Math.PI, true);
    ctx.stroke();

    // Sculpted Nose ridge
    ctx.beginPath();
    ctx.moveTo(128, 95);
    ctx.lineTo(128, 142);
    ctx.lineTo(138, 142);
    ctx.stroke();

    // Perfect designer outline lips
    ctx.beginPath();
    ctx.arc(128, 165, 20, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  };

  // 3. Main 3D Initializer
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = Math.max(containerRef.current.clientHeight, 480);

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050906');
    sceneRef.current = scene;

    // Create Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.7, 4.4);
    cameraRef.current = camera;

    // WebGL Renderer Config
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Boutique Presentation Rack
    const standGroup = new THREE.Group();
    const floorGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.04, 32);
    const metalMat = new THREE.MeshStandardMaterial({
      color: '#151e18',
      roughness: 0.2,
      metalness: 0.95,
    });
    const floorStand = new THREE.Mesh(floorGeo, metalMat);
    floorStand.position.y = -1.8;
    standGroup.add(floorStand);

    const poleGeo = new THREE.CylinderGeometry(0.016, 0.016, 3.4, 16);
    const verticalPole = new THREE.Mesh(poleGeo, metalMat);
    verticalPole.position.set(0, -0.1, -0.4);
    standGroup.add(verticalPole);

    scene.add(standGroup);
    standMeshRef.current = standGroup;

    // Materials Initialization
    primaryMaterialRef.current = new THREE.MeshStandardMaterial({
      roughness: config.roughness,
      metalness: config.metalness,
      bumpScale: 0.012,
      side: THREE.DoubleSide
    });

    accentMaterialRef.current = new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.accentColor),
      roughness: 0.2,
      metalness: 0.85,
      side: THREE.DoubleSide
    });

    glowMaterialRef.current = new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.glowColor),
      emissive: new THREE.Color(config.glowColor),
      emissiveIntensity: config.glowStrength,
      metalness: 0.5,
      roughness: 0.1,
    });

    // Garment and Mannequin Groups
    const mannequinGroup = new THREE.Group();
    scene.add(mannequinGroup);
    mannequinMeshRef.current = mannequinGroup;

    const upperGroup = new THREE.Group();
    upperGroup.position.y = 0.5;
    scene.add(upperGroup);
    upperMeshRef.current = upperGroup;

    const lowerGroup = new THREE.Group();
    lowerGroup.position.y = -0.38;
    scene.add(lowerGroup);
    lowerMeshRef.current = lowerGroup;

    // Lighting Settings Configuration
    const setupLights = (preset: typeof activePresetLighting) => {
      const oldLights = scene.children.filter(child => child instanceof THREE.Light);
      oldLights.forEach(light => scene.remove(light));

      const ambient = new THREE.AmbientLight();
      ambient.intensity = 0.55;
      scene.add(ambient);

      if (preset === 'studio') {
        ambient.color.setHex(0xdceee2);
        ambient.intensity = 0.7;

        const mainLight = new THREE.DirectionalLight('#ffffff', 2.3);
        mainLight.position.set(6, 6, 4.5);
        scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight('#edfdf3', 1.2);
        fillLight.position.set(-6, 2.5, 3.5);
        scene.add(fillLight);

        const rimLight = new THREE.PointLight('#aee9b4', 1.8, 12);
        rimLight.position.set(0, 3.5, -4.5);
        scene.add(rimLight);
      } else if (preset === 'neon') {
        ambient.color.setHex(0x0f1c11);
        ambient.intensity = 0.4;

        const greenNeon = new THREE.PointLight('#4ade80', 4.0, 15);
        greenNeon.position.set(-3.5, 1.2, 2.5);
        scene.add(greenNeon);

        const violetNeon = new THREE.PointLight('#c084fc', 4.5, 15);
        violetNeon.position.set(3.5, 1.8, 1.5);
        scene.add(violetNeon);

        const cyanNeon = new THREE.DirectionalLight('#22d3ee', 2.5);
        cyanNeon.position.set(0, 7, 3);
        scene.add(cyanNeon);
      } else if (preset === 'velvet') {
        ambient.color.setHex(0x2d141e);
        ambient.intensity = 0.55;

        const warmLight = new THREE.DirectionalLight('#fed7aa', 3.0);
        warmLight.position.set(5, 5.5, 3);
        scene.add(warmLight);

        const goldHighlight = new THREE.PointLight('#fbbf24', 4.0, 12);
        goldHighlight.position.set(-3.2, -0.8, 3.2);
        scene.add(goldHighlight);
      } else if (preset === 'sunlight') {
        ambient.color.setHex(0xfef5e7);
        ambient.intensity = 0.9;

        const sun = new THREE.DirectionalLight('#fffbeb', 4.5);
        sun.position.set(9, 10.5, 5.5);
        scene.add(sun);

        const skyFill = new THREE.DirectionalLight('#93c5fd', 1.0);
        skyFill.position.set(-9, 3.5, 2.5);
        scene.add(skyFill);
      }
    };

    setupLights(activePresetLighting);
    rebuildCoreDesignLayout();

    // Resize Observer for frame fluid sizing
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const w = entry.contentRect.width;
      const h = Math.max(entry.contentRect.height, 480);
      
      if (rendererRef.current && cameraRef.current) {
        rendererRef.current.setSize(w, h);
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
      }
    });
    resizeObserver.observe(containerRef.current);

    // Render Animation Loop
    let animId: number;
    let angle = 0;
    
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isRotating && !isDragging) {
        angle += 0.007;
        const rotVal = angle % (Math.PI * 2);
        
        if (upperMeshRef.current) upperMeshRef.current.rotation.y = rotVal;
        if (lowerMeshRef.current) lowerMeshRef.current.rotation.y = rotVal;
        if (mannequinMeshRef.current) mannequinMeshRef.current.rotation.y = rotVal;
        if (standMeshRef.current) standMeshRef.current.rotation.y = rotVal;
      } else if (isDragging) {
        if (upperMeshRef.current) {
          upperMeshRef.current.rotation.y = THREE.MathUtils.lerp(upperMeshRef.current.rotation.y, customRotY, 0.15);
          upperMeshRef.current.rotation.x = THREE.MathUtils.lerp(upperMeshRef.current.rotation.x, customRotX, 0.15);
        }
        if (lowerMeshRef.current) {
          lowerMeshRef.current.rotation.y = THREE.MathUtils.lerp(lowerMeshRef.current.rotation.y, customRotY, 0.15);
          lowerMeshRef.current.rotation.x = THREE.MathUtils.lerp(lowerMeshRef.current.rotation.x, customRotX, 0.15);
        }
        if (mannequinMeshRef.current) {
          mannequinMeshRef.current.rotation.y = THREE.MathUtils.lerp(mannequinMeshRef.current.rotation.y, customRotY, 0.15);
          mannequinMeshRef.current.rotation.x = THREE.MathUtils.lerp(mannequinMeshRef.current.rotation.x, customRotX, 0.15);
        }
        if (standMeshRef.current) {
          standMeshRef.current.rotation.y = THREE.MathUtils.lerp(standMeshRef.current.rotation.y, customRotY, 0.15);
        }
      }

      // Counter-rotate/animate custom technological energy ribbons wrapping the mannequin
      if (energyRibbonsRef.current) {
        energyRibbonsRef.current.rotation.y -= 0.015;
        const time = Date.now() * 0.0025;
        energyRibbonsRef.current.position.y = Math.sin(time) * 0.035;
      }

      // Animate drifting star dust particles upwards
      if (particleSystemRef.current) {
        const pPositions = particleSystemRef.current.geometry.attributes.position.array as Float32Array;
        const count = pPositions.length / 3;
        const time = Date.now() * 0.001;
        for (let i = 0; i < count; i++) {
          pPositions[i * 3 + 1] += 0.0049; // upward drift velocity
          pPositions[i * 3] += Math.sin(time + i) * 0.0015; // wave left/right
          if (pPositions[i * 3 + 1] > 2.0) {
            pPositions[i * 3 + 1] = -1.8; // recycle to floor height
          }
        }
        particleSystemRef.current.geometry.attributes.position.needsUpdate = true;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      if (rendererRef.current && rendererRef.current.domElement.parentNode) {
        rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  // Update dynamic lights
  const updateLights = (preset: 'studio' | 'neon' | 'velvet' | 'sunlight') => {
    setActivePresetLighting(preset);
    const scene = sceneRef.current;
    if (!scene) return;

    const oldLights = scene.children.filter(child => child instanceof THREE.Light);
    oldLights.forEach(light => scene.remove(light));

    const ambient = new THREE.AmbientLight();
    ambient.intensity = 0.55;
    scene.add(ambient);

    if (preset === 'studio') {
      ambient.color.setHex(0xdceee2);
      ambient.intensity = 0.7;

      const mainLight = new THREE.DirectionalLight('#ffffff', 2.3);
      mainLight.position.set(6, 6, 4.5);
      scene.add(mainLight);

      const fillLight = new THREE.DirectionalLight('#edfdf3', 1.2);
      fillLight.position.set(-6, 2.5, 3.5);
      scene.add(fillLight);

      const rimLight = new THREE.PointLight('#aee9b4', 1.8, 12);
      rimLight.position.set(0, 3.5, -4.5);
      scene.add(rimLight);
    } else if (preset === 'neon') {
      ambient.color.setHex(0x0f1c11);
      ambient.intensity = 0.4;

      const greenNeon = new THREE.PointLight('#4ade80', 4.0, 15);
      greenNeon.position.set(-3.5, 1.2, 2.5);
      scene.add(greenNeon);

      const violetNeon = new THREE.PointLight('#c084fc', 4.5, 15);
      violetNeon.position.set(3.5, 1.8, 1.5);
      scene.add(violetNeon);

      const cyanNeon = new THREE.DirectionalLight('#22d3ee', 2.5);
      cyanNeon.position.set(0, 7, 3);
      scene.add(cyanNeon);
    } else if (preset === 'velvet') {
      ambient.color.setHex(0x2d141e);
      ambient.intensity = 0.55;

      const warmLight = new THREE.DirectionalLight('#fed7aa', 3.0);
      warmLight.position.set(5, 5.5, 3);
      scene.add(warmLight);

      const goldHighlight = new THREE.PointLight('#fbbf24', 4.0, 12);
      goldHighlight.position.set(-3.2, -0.8, 3.2);
      scene.add(goldHighlight);
    } else if (preset === 'sunlight') {
      ambient.color.setHex(0xfef5e7);
      ambient.intensity = 0.9;

      const sun = new THREE.DirectionalLight('#fffbeb', 4.5);
      sun.position.set(9, 10.5, 5.5);
      scene.add(sun);

      const skyFill = new THREE.DirectionalLight('#93c5fd', 1.0);
      skyFill.position.set(-9, 3.5, 2.5);
      scene.add(skyFill);
    }
  };

  // Rebuild design when configuration inputs update
  useEffect(() => {
    rebuildCoreDesignLayout();
  }, [config, zoomLevel, showMannequin]);

  const rebuildCoreDesignLayout = () => {
    const sGroupUpper = upperMeshRef.current;
    const sGroupLower = lowerMeshRef.current;
    const sGroupMannequin = mannequinMeshRef.current;
    if (!sGroupUpper || !sGroupLower || !sGroupMannequin) return;

    // Clear old particles if they exist in the scene
    if (particleSystemRef.current && sceneRef.current) {
      sceneRef.current.remove(particleSystemRef.current);
      particleSystemRef.current.geometry.dispose();
      (particleSystemRef.current.material as THREE.Material).dispose();
      particleSystemRef.current = null;
    }

    // Clear old meshes
    while (sGroupUpper.children.length > 0) sGroupUpper.remove(sGroupUpper.children[0]);
    while (sGroupLower.children.length > 0) sGroupLower.remove(sGroupLower.children[0]);
    while (sGroupMannequin.children.length > 0) sGroupMannequin.remove(sGroupMannequin.children[0]);

    // Material setups
    if (primaryMaterialRef.current) {
      primaryMaterialRef.current.roughness = config.roughness;
      primaryMaterialRef.current.metalness = config.metalness;
      
      if (primaryMaterialRef.current.map) {
        primaryMaterialRef.current.map.dispose();
      }
      primaryMaterialRef.current.map = createProceduralTexture(config);
      primaryMaterialRef.current.needsUpdate = true;
    }

    if (accentMaterialRef.current) {
      accentMaterialRef.current.color.set(config.accentColor);
    }

    if (glowMaterialRef.current) {
      glowMaterialRef.current.color.set(config.glowColor);
      glowMaterialRef.current.emissive.set(config.glowColor);
      glowMaterialRef.current.emissiveIntensity = config.glowStrength * 1.6;
    }

    if (cameraRef.current) {
      cameraRef.current.position.z = 4.4 / zoomLevel;
    }

    // ==========================================
    // A. CORE REALISTIC MALE MANNEQUIN BODY DESIGNS
    // ==========================================
    const mannequinMaterial = new THREE.MeshStandardMaterial({
      color: '#1b221d', // Luxury brushed dark forest-tint slate
      roughness: 0.28,
      metalness: 0.8,
    });

    const metalMat = new THREE.MeshStandardMaterial({
      color: '#151e18',
      roughness: 0.2,
      metalness: 0.95,
    });
    
    const bodySubGroup = new THREE.Group();
    sGroupMannequin.add(bodySubGroup);

    // 1. Oval Head & Neck
    const neckGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.22, 16);
    const neck = new THREE.Mesh(neckGeo, mannequinMaterial);
    neck.position.set(0, 1.15, 0);
    neck.castShadow = true;
    bodySubGroup.add(neck);

    const craniumGeo = new THREE.SphereGeometry(0.19, 32, 32);
    const cranium = new THREE.Mesh(craniumGeo, mannequinMaterial);
    cranium.position.set(0, 1.34, 0);
    cranium.scale.set(1.0, 1.22, 0.96);
    cranium.castShadow = true;
    bodySubGroup.add(cranium);

    // Small human ear details for high fidelity
    const earGeo = new THREE.SphereGeometry(0.02, 8, 8);
    const leftEar = new THREE.Mesh(earGeo, mannequinMaterial);
    leftEar.position.set(-0.195, 1.34, 0);
    leftEar.scale.set(0.6, 1.5, 1.0);
    const rightEar = new THREE.Mesh(earGeo, mannequinMaterial);
    rightEar.position.set(0.195, 1.34, 0);
    rightEar.scale.set(0.6, 1.5, 1.0);
    bodySubGroup.add(leftEar, rightEar);

    // 2. High fidelity front face plate for holding uploaded headshots
    // Implemented as a beautifully curved 3D visor wrapping the head sphere to prevent clipping
    const faceMaterial = new THREE.MeshStandardMaterial({
      roughness: 0.15,
      metalness: 0.2,
      transparent: true,
      side: THREE.DoubleSide, // Ensure visibility from all rotation angles
    });

    if (config.faceImageUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(config.faceImageUrl, (tex) => {
        if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        faceMaterial.map = tex;
        faceMaterial.needsUpdate = true;
      });
    } else {
      faceMaterial.map = createDefaultFaceTexture();
    }

    // Create a precise spherically curved visor segment
    const facePlateGeo = new THREE.SphereGeometry(
      0.191,               // radius matching cranium sphere
      32,                  // width segments
      32,                  // height segments
      Math.PI * 0.35,      // phiStart (centered on the front)
      Math.PI * 0.3,       // phiLength (curving perfectly)
      Math.PI * 0.23,      // thetaStart (forehead)
      Math.PI * 0.44       // thetaLength (chin)
    );
    const facePlate = new THREE.Mesh(facePlateGeo, faceMaterial);
    facePlate.position.set(0, 1.34, 0); // Exact center of cranium
    facePlate.scale.set(1.025, 1.222, 0.985); // Safe 2% scaling to prevent z-fighting clipping
    sGroupMannequin.add(facePlate);

    // 3. Anatomical Torso Frame (Provides support forms inside sleeves)
    const chestGeo = new THREE.CylinderGeometry(0.28, 0.22, 0.58, 20);
    const chest = new THREE.Mesh(chestGeo, mannequinMaterial);
    chest.position.set(0, 0.65, 0);
    chest.castShadow = true;
    bodySubGroup.add(chest);

    const shoulderJointGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.74, 16);
    const shoulderJoint = new THREE.Mesh(shoulderJointGeo, mannequinMaterial);
    shoulderJoint.rotation.z = Math.PI / 2;
    shoulderJoint.position.set(0, 0.94, 0);
    bodySubGroup.add(shoulderJoint);

    // Anatomical Pelvis Core
    const pelvisGeo = new THREE.CylinderGeometry(0.22, 0.24, 0.22, 16);
    const pelvis = new THREE.Mesh(pelvisGeo, mannequinMaterial);
    pelvis.position.set(0, 0.25, 0);
    bodySubGroup.add(pelvis);

    // 4. Masculine poseable limbs
    const leftArmGeo = new THREE.CylinderGeometry(0.065, 0.05, 0.52, 16);
    const leftArm = new THREE.Mesh(leftArmGeo, mannequinMaterial);
    leftArm.position.set(-0.39, 0.65, 0.05);
    leftArm.rotation.z = 0.15;
    leftArm.rotation.x = 0.1;
    leftArm.castShadow = true;

    const leftForearmGeo = new THREE.CylinderGeometry(0.05, 0.042, 0.42, 16);
    const leftForearm = new THREE.Mesh(leftForearmGeo, mannequinMaterial);
    leftForearm.position.set(-0.43, 0.24, 0.14);
    leftForearm.rotation.z = -0.08;
    leftForearm.rotation.x = 0.35;
    leftForearm.castShadow = true;

    const leftHandGeo = new THREE.SphereGeometry(0.04, 12, 12);
    const leftHand = new THREE.Mesh(leftHandGeo, mannequinMaterial);
    leftHand.position.set(-0.42, 0.03, 0.22);
    leftHand.scale.set(0.65, 1.2, 0.9);
    bodySubGroup.add(leftArm, leftForearm, leftHand);

    // Symmetric Right Arm structures
    const rightArmGeo = new THREE.CylinderGeometry(0.065, 0.05, 0.52, 16);
    const rightArm = new THREE.Mesh(rightArmGeo, mannequinMaterial);
    rightArm.position.set(0.39, 0.65, 0.05);
    rightArm.rotation.z = -0.15;
    rightArm.rotation.x = 0.1;
    rightArm.castShadow = true;

    const rightForearmGeo = new THREE.CylinderGeometry(0.05, 0.042, 0.42, 16);
    const rightForearm = new THREE.Mesh(rightForearmGeo, mannequinMaterial);
    rightForearm.position.set(0.43, 0.24, 0.14);
    rightForearm.rotation.z = 0.08;
    rightForearm.rotation.x = 0.35;
    rightForearm.castShadow = true;

    const rightHandGeo = new THREE.SphereGeometry(0.04, 12, 12);
    const rightHand = new THREE.Mesh(rightHandGeo, mannequinMaterial);
    rightHand.position.set(0.42, 0.03, 0.22);
    rightHand.scale.set(0.65, 1.2, 0.9);
    bodySubGroup.add(rightArm, rightForearm, rightHand);

    // 5. Solid leg outline & Footwear for try-on support
    const leftThighGeo = new THREE.CylinderGeometry(0.14, 0.11, 0.65, 16);
    const leftThigh = new THREE.Mesh(leftThighGeo, mannequinMaterial);
    leftThigh.position.set(-0.13, -0.05, 0);
    leftThigh.castShadow = true;

    const leftCalfGeo = new THREE.CylinderGeometry(0.11, 0.078, 0.72, 16);
    const leftCalf = new THREE.Mesh(leftCalfGeo, mannequinMaterial);
    leftCalf.position.set(-0.13, -0.72, 0.04);
    leftCalf.castShadow = true;

    const footLeftGeo = new THREE.BoxGeometry(0.12, 0.09, 0.25);
    const leftFoot = new THREE.Mesh(footLeftGeo, metalMat);
    leftFoot.position.set(-0.13, -1.14, 0.1);
    leftFoot.castShadow = true;
    bodySubGroup.add(leftThigh, leftCalf, leftFoot);

    // Right Leg structures
    const rightThighGeo = new THREE.CylinderGeometry(0.14, 0.11, 0.65, 16);
    const rightThigh = new THREE.Mesh(rightThighGeo, mannequinMaterial);
    rightThigh.position.set(0.13, -0.05, 0);
    rightThigh.castShadow = true;

    const rightCalfGeo = new THREE.CylinderGeometry(0.11, 0.078, 0.72, 16);
    const rightCalf = new THREE.Mesh(rightCalfGeo, mannequinMaterial);
    rightCalf.position.set(0.13, -0.72, 0.04);
    rightCalf.castShadow = true;

    const footRightGeo = new THREE.BoxGeometry(0.12, 0.09, 0.25);
    const rightFoot = new THREE.Mesh(footRightGeo, metalMat);
    rightFoot.position.set(0.13, -1.14, 0.1);
    rightFoot.castShadow = true;
    bodySubGroup.add(rightThigh, rightCalf, rightFoot);

    // ==========================================
    // B. BUILD UPPER GARMENTS TRY-ONS
    // ==========================================
    const upperGeoGroup = new THREE.Group();
    upperGeoGroup.scale.set(config.itemScaleX, config.itemScaleY, 1.0);

    let upperBodyGeo: THREE.BufferGeometry;
    let placket: THREE.Mesh | null = null;
    let accessoryHood: THREE.Mesh | null = null;
    let lapelLeft: THREE.Mesh | null = null;
    let lapelRight: THREE.Mesh | null = null;

    if (config.upperType === 'hoodie') {
      // Big cozy boxier hoodie cut
      upperBodyGeo = new THREE.CylinderGeometry(0.33, 0.31, 0.88, 24);
      // Large Kangaroo front pocket
      const pocketGeo = new THREE.BoxGeometry(0.21, 0.15, 0.09);
      const pocket = new THREE.Mesh(pocketGeo, primaryMaterialRef.current!);
      pocket.position.set(0, -0.16, 0.19);
      upperGeoGroup.add(pocket);

      // Hoodie cowl neck band
      const hoodNeckGeo = new THREE.CylinderGeometry(0.14, 0.17, 0.12, 24);
      const hoodNeck = new THREE.Mesh(hoodNeckGeo, accentMaterialRef.current!);
      hoodNeck.position.set(0, 0.44, 0.02);
      upperGeoGroup.add(hoodNeck);

      // Folded back hood shape
      const hoodBackGeo = new THREE.SphereGeometry(0.17, 20, 20);
      accessoryHood = new THREE.Mesh(hoodBackGeo, primaryMaterialRef.current!);
      accessoryHood.position.set(0, 0.36, -0.16);
      accessoryHood.scale.set(1.05, 1.25, 1.12);
      upperGeoGroup.add(accessoryHood);

    } else if (config.upperType === 'shirt') {
      upperBodyGeo = new THREE.CylinderGeometry(0.30, 0.28, 0.82, 24);
      // Button placket piping details
      const placketGeo = new THREE.BoxGeometry(0.032, 0.82, 0.02);
      placket = new THREE.Mesh(placketGeo, accentMaterialRef.current!);
      placket.position.set(0, 0, 0.305);
      upperGeoGroup.add(placket);

    } else if (config.upperType === 'suit') {
      upperBodyGeo = new THREE.CylinderGeometry(0.32, 0.29, 0.88, 24);
      // Tuxedo collar lapels
      const lGeo = new THREE.ConeGeometry(0.08, 0.48, 4);
      lapelLeft = new THREE.Mesh(lGeo, accentMaterialRef.current!);
      lapelLeft.position.set(-0.14, 0.18, 0.25);
      lapelLeft.rotation.set(0.1, -0.2, -0.5);

      lapelRight = new THREE.Mesh(lGeo, accentMaterialRef.current!);
      lapelRight.position.set(0.14, 0.18, 0.25);
      lapelRight.rotation.set(0.1, 0.2, 0.5);
      upperGeoGroup.add(lapelLeft, lapelRight);

    } else if (config.upperType === 'tshirt') {
      upperBodyGeo = new THREE.CylinderGeometry(0.302, 0.285, 0.76, 24);

    } else if (config.upperType === 'gown') {
      upperBodyGeo = new THREE.CylinderGeometry(0.27, 0.32, 0.65, 24);

    } else if (config.upperType === 'crop_top') {
      upperBodyGeo = new THREE.CylinderGeometry(0.28, 0.25, 0.36, 24);

    } else { // cloak
      upperBodyGeo = new THREE.CylinderGeometry(0.27, 0.52, 1.15, 24);
    }

    const torsoMesh = new THREE.Mesh(upperBodyGeo, primaryMaterialRef.current!);
    torsoMesh.position.set(0, 0.05, 0);
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    upperGeoGroup.add(torsoMesh);

    // Custom Sleeves Try-ons
    if (config.sleeveType !== 'sleeveless') {
      let sleeveLength = 0.52;
      let sleeveRad = 0.085;

      if (config.sleeveType === 'short') {
        sleeveLength = 0.24;
      } else if (config.sleeveType === 'puff') {
        sleeveLength = 0.25;
        sleeveRad = 0.14;
      } else if (config.sleeveType === 'long' || config.upperType === 'hoodie') {
        sleeveLength = 0.62;
      }

      // Left Sleeve
      const leftSleeveGeo = new THREE.CylinderGeometry(sleeveRad * 1.05, sleeveRad, sleeveLength, 16);
      const lSleeve = new THREE.Mesh(leftSleeveGeo, primaryMaterialRef.current!);
      lSleeve.position.set(-0.43 - (sleeveLength * 0.1), 0.28 - (sleeveLength * 0.25), 0.05);
      lSleeve.rotation.z = Math.PI / 4 + 0.12;
      lSleeve.rotation.x = 0.15;
      lSleeve.castShadow = true;

      // Add contrast cuff bands to sleeves if long sleeve selected
      if (config.sleeveType === 'long' || config.upperType === 'hoodie') {
        const lCuffGeo = new THREE.CylinderGeometry(sleeveRad * 1.06, sleeveRad * 1.06, 0.05, 16);
        const leftCuff = new THREE.Mesh(lCuffGeo, accentMaterialRef.current!);
        leftCuff.position.set(0, -sleeveLength / 2, 0);
        lSleeve.add(leftCuff);
      }
      upperGeoGroup.add(lSleeve);

      // Right Sleeve
      const rightSleeveGeo = new THREE.CylinderGeometry(sleeveRad * 1.05, sleeveRad, sleeveLength, 16);
      const rSleeve = new THREE.Mesh(rightSleeveGeo, primaryMaterialRef.current!);
      rSleeve.position.set(0.43 + (sleeveLength * 0.1), 0.28 - (sleeveLength * 0.25), 0.05);
      rSleeve.rotation.z = -(Math.PI / 4 + 0.12);
      rSleeve.rotation.x = 0.15;
      rSleeve.castShadow = true;

      if (config.sleeveType === 'long' || config.upperType === 'hoodie') {
        const rCuffGeo = new THREE.CylinderGeometry(sleeveRad * 1.06, sleeveRad * 1.06, 0.05, 16);
        const rightCuff = new THREE.Mesh(rCuffGeo, accentMaterialRef.current!);
        rightCuff.position.set(0, -sleeveLength / 2, 0);
        rSleeve.add(rightCuff);
      }
      upperGeoGroup.add(rSleeve);
    }

    // Collar Settings
    if (config.collarType === 'classic' || config.upperType === 'shirt') {
      const colGeo = new THREE.CylinderGeometry(0.14, 0.155, 0.08, 24);
      const colMesh = new THREE.Mesh(colGeo, accentMaterialRef.current!);
      colMesh.position.set(0, 0.44, 0.02);
      upperGeoGroup.add(colMesh);
    } else if (config.collarType === 'turtleneck') {
      const colGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.15, 24);
      const colMesh = new THREE.Mesh(colGeo, primaryMaterialRef.current!);
      colMesh.position.set(0, 0.47, 0.01);
      upperGeoGroup.add(colMesh);
    } else if (config.collarType === 'v_neck') {
      const edgeGeo = new THREE.TorusGeometry(0.13, 0.018, 8, 24);
      const edgeMesh = new THREE.Mesh(edgeGeo, accentMaterialRef.current!);
      edgeMesh.position.set(0, 0.41, 0.06);
      edgeMesh.rotation.x = Math.PI / 2.5;
      upperGeoGroup.add(edgeMesh);
    }

    // Edge glowing pipelines
    if (config.glowStrength > 0) {
      const edges = new THREE.EdgesGeometry(torsoMesh.geometry);
      const edgeGlow = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
        color: config.glowColor,
        linewidth: 2.5,
      }));
      edgeGlow.position.copy(torsoMesh.position);
      upperGeoGroup.add(edgeGlow);
    }

    sGroupUpper.add(upperGeoGroup);

    // ==========================================
    // C. BUILD LOWER GARMENTS TRY-ONS (JEANS, PANTS)
    // ==========================================
    const lowerGeoGroup = new THREE.Group();
    lowerGeoGroup.scale.set(config.itemScaleX, 1.0, 1.0);

    let lowerPartGeo: THREE.BufferGeometry | null = null;

    if (config.lowerType === 'jeans' || config.lowerType === 'pants') {
      // Sculpted Left & Right Leg fittings
      const trouserLegLeftGeo = new THREE.CylinderGeometry(0.165, 0.115, 1.15, 16);
      const tLegLeft = new THREE.Mesh(trouserLegLeftGeo, primaryMaterialRef.current!);
      tLegLeft.position.set(-0.13, 0.06, 0.03);
      tLegLeft.castShadow = true;
      lowerGeoGroup.add(tLegLeft);

      const trouserLegRightGeo = new THREE.CylinderGeometry(0.165, 0.115, 1.15, 16);
      const tLegRight = new THREE.Mesh(trouserLegRightGeo, primaryMaterialRef.current!);
      tLegRight.position.set(0.13, 0.06, 0.03);
      tLegRight.castShadow = true;
      lowerGeoGroup.add(tLegRight);

      // Luxury belt line trim
      const beltGeo = new THREE.CylinderGeometry(0.245, 0.245, 0.06, 24);
      const belt = new THREE.Mesh(beltGeo, accentMaterialRef.current!);
      belt.position.set(0, 0.64, 0);
      lowerGeoGroup.add(belt);

      // Jeans Stitch Details in front
      if (config.lowerType === 'jeans') {
        const stitchesGeo = new THREE.BoxGeometry(0.03, 0.25, 0.019);
        const stitches = new THREE.Mesh(stitchesGeo, accentMaterialRef.current!);
        stitches.position.set(0, 0.52, 0.24);
        lowerGeoGroup.add(stitches);
      }

    } else if (config.lowerType === 'shorts') {
      const shortLeftGeo = new THREE.CylinderGeometry(0.18, 0.17, 0.36, 16);
      const sLeft = new THREE.Mesh(shortLeftGeo, primaryMaterialRef.current!);
      sLeft.position.set(-0.13, 0.45, 0.02);
      lowerGeoGroup.add(sLeft);

      const shortRightGeo = new THREE.CylinderGeometry(0.18, 0.17, 0.36, 16);
      const sRight = new THREE.Mesh(shortRightGeo, primaryMaterialRef.current!);
      sRight.position.set(0.13, 0.45, 0.02);
      lowerGeoGroup.add(sRight);

      const beltGeo = new THREE.CylinderGeometry(0.248, 0.248, 0.06, 24);
      const belt = new THREE.Mesh(beltGeo, accentMaterialRef.current!);
      belt.position.set(0, 0.63, 0);
      lowerGeoGroup.add(belt);

    } else if (config.lowerType === 'skirt_pleated') {
      // Dynamic Pleated geometric skirt logic
      const radiusTop = 0.23;
      const radiusBottom = 0.58;
      const heightVal = 0.65;
      const segments = 24;
      
      const skirtGeometry = new THREE.BufferGeometry();
      const vertices: number[] = [];
      const indices: number[] = [];
      const uvs: number[] = [];

      for (let i = 0; i <= segments; i++) {
        const pct = (i / segments) * Math.PI * 2;
        const pleateAmp = i % 2 === 0 ? 0.03 : -0.03;

        const rt = radiusTop + pleateAmp * 0.1;
        const rb = radiusBottom + pleateAmp * 0.35;

        const tx = Math.cos(pct) * rt;
        const tz = Math.sin(pct) * rt;
        vertices.push(tx, heightVal / 2, tz);
        uvs.push(i / segments, 1);

        const bx = Math.cos(pct) * rb;
        const bz = Math.sin(pct) * rb;
        vertices.push(bx, -heightVal / 2, bz);
        uvs.push(i / segments, 0);
      }

      for (let i = 0; i < segments; i++) {
        const next = i + 1;
        indices.push(i * 2, next * 2, i * 2 + 1);
        indices.push(next * 2, next * 2 + 1, i * 2 + 1);
      }

      skirtGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      skirtGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      skirtGeometry.setIndex(indices);
      skirtGeometry.computeVertexNormals();
      lowerPartGeo = skirtGeometry;

    } else if (config.lowerType === 'skirt_flared') {
      lowerPartGeo = new THREE.CylinderGeometry(0.24, 0.62, 0.62, 24);
    } else { // gown_long
      lowerPartGeo = new THREE.CylinderGeometry(0.24, 0.85, 1.25, 32);
    }

    if (lowerPartGeo) {
      const skirtMesh = new THREE.Mesh(lowerPartGeo, primaryMaterialRef.current!);
      skirtMesh.position.set(0, 0.2, 0);
      skirtMesh.castShadow = true;
      skirtMesh.receiveShadow = true;
      lowerGeoGroup.add(skirtMesh);

      // Waist Buckle accents
      const buckleGeo = new THREE.CylinderGeometry(0.25, 0.26, 0.07, 24);
      const buckle = new THREE.Mesh(buckleGeo, accentMaterialRef.current!);
      buckle.position.set(0, 0.52, 0);
      lowerGeoGroup.add(buckle);
    }

    sGroupLower.add(lowerGeoGroup);

    bodySubGroup.visible = showMannequin;

    // F. FLOATING RADIAL COORDINATE GRID FLOOR
    const gridHelper = new THREE.GridHelper(3.8, 14, '#244e29', '#0d1a0f');
    gridHelper.position.y = -1.78; // aligned flush on pedestal disc base
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.55;
    sGroupMannequin.add(gridHelper);

    // G. HIGH-FIDELITY CYBERNETIC COAXIAL ROTATING ENERGY FIBERS/RIBBONS
    const ribbonGroup = new THREE.Group();
    energyRibbonsRef.current = ribbonGroup;
    sGroupMannequin.add(ribbonGroup);

    const ribbonMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(config.glowColor),
      transparent: true,
      opacity: Math.max(0.35, config.glowStrength / 10),
      blending: THREE.AdditiveBlending,
    });

    const numRibbons = 3;
    const pointsPerRibbon = 60;

    for (let r = 0; r < numRibbons; r++) {
      const ribbonPoints: THREE.Vector3[] = [];
      const phaseOffset = (r * Math.PI * 2) / numRibbons;
      
      for (let i = 0; i < pointsPerRibbon; i++) {
        const t = i / (pointsPerRibbon - 1);
        const angle = t * Math.PI * 7.5 + phaseOffset; // spiral curves
        const radius = 0.44 + Math.sin(t * Math.PI) * 0.14; // sweeping around the chest
        
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = -1.5 + t * 2.9; // vertical height span
        
        ribbonPoints.push(new THREE.Vector3(x, y, z));
      }
      
      const curve = new THREE.CatmullRomCurve3(ribbonPoints);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(120));
      const line = new THREE.Line(curveGeo, ribbonMaterial);
      ribbonGroup.add(line);
    }

    // H. FLOATING BOUTIQUE COSMIC DUST/STARFIELD PARTICLES SYSTEM
    if (sceneRef.current) {
      const particleCount = 130;
      const particlesGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.4 + Math.random() * 1.9;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = -1.8 + Math.random() * 3.7; // distributed in vertical display column
        positions[i * 3 + 2] = Math.sin(angle) * radius;
      }
      
      particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const pMaterial = new THREE.PointsMaterial({
        color: new THREE.Color(config.glowColor),
        size: 0.024,
        transparent: true,
        opacity: Math.max(0.4, Math.min(1.0, config.glowStrength / 6)),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      
      const particleSystem = new THREE.Points(particlesGeo, pMaterial);
      particleSystemRef.current = particleSystem;
      sceneRef.current.add(particleSystem);
    }
  };

  // Drag listeners
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    prevMousePosition.current = {
      x: e.clientX,
      y: e.clientY
    };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - prevMousePosition.current.x;
    const deltaY = e.clientY - prevMousePosition.current.y;

    setCustomRotY((prev) => prev + deltaX * 0.015);
    setCustomRotX((prev) => Math.max(-0.6, Math.min(0.6, prev + deltaY * 0.01)));

    prevMousePosition.current = {
      x: e.clientX,
      y: e.clientY
    };
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className={`relative flex flex-col h-full select-none ${className}`} id="canvas-container-box">
      <div 
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className="w-full flex-grow relative cursor-grab active:cursor-grabbing overflow-hidden min-h-[480px] rounded-2xl border border-[#1b3d22]/50 bg-gradient-to-b from-[#060a07] to-[#010402]"
        id="three-canvas-root"
      >
        {/* Floating Controls HUD Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 bg-black/55 backdrop-blur-md px-3.5 py-2.5 rounded-lg border border-[#2b5932]/30 pointer-events-auto shadow-xl" id="hud-controls">
          <h4 className="text-[10px] uppercase tracking-widest text-[#a4ffa2] font-bold">Studio Controls</h4>
          <div className="flex items-center gap-1.5 mt-1">
            <button 
              onClick={() => setIsRotating(!isRotating)}
              className="p-2 rounded bg-white/5 hover:bg-[#2b5932]/20 hover:text-[#a4ffa2] text-white transition-all border border-white/5"
              title={isRotating ? 'Pause auto spin' : 'Play auto spin'}
              id="spin-toggle-btn"
            >
              {isRotating ? <Pause size={13} /> : <Play size={13} />}
            </button>
            <button 
              onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.15))}
              className="p-2 rounded bg-white/5 hover:bg-[#2b5932]/20 hover:text-[#a4ffa2] text-white transition-all border border-white/5"
              title="Zoom In"
              id="zoom-in-btn"
            >
              <ZoomIn size={13} />
            </button>
            <button 
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.15))}
              className="p-2 rounded bg-white/5 hover:bg-[#2b5932]/20 hover:text-[#a4ffa2] text-white transition-all border border-white/5"
              title="Zoom Out"
              id="zoom-out-btn"
            >
              <ZoomOut size={13} />
            </button>
            <button 
              onClick={() => {
                setCustomRotX(0);
                setCustomRotY(0);
                setIsRotating(true);
              }}
              className="p-2 rounded bg-white/5 hover:bg-[#2b5932]/20 hover:text-[#a4ffa2] text-white transition-all border border-white/5"
              title="Reset Rotation"
              id="reset-rot-btn"
            >
              <RotateCw size={11} />
            </button>
            <button 
              onClick={() => setShowMannequin(!showMannequin)}
              className={`p-2 rounded transition-all border border-white/5 ${showMannequin ? 'bg-[#2b5932]/20 text-[#a4ffa2]' : 'bg-red-950/20 text-red-400 hover:bg-red-950/40 border-red-500/20'}`}
              title={showMannequin ? 'Ghost Model Mode (Invisible Body)' : 'Standard Model Mode (Visible Body)'}
              id="toggle-mannequin-vis-btn"
            >
              {showMannequin ? <Eye size={13} /> : <EyeOff size={13} />}
            </button>
          </div>
        </div>

        {/* Dynamic Light Sweepers panel */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-10 flex flex-wrap gap-2.5 bg-black/60 backdrop-blur-md p-3.5 rounded-xl border border-[#2b5932]/30 shadow-xl" id="preset-lights-panel">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-[#a4ffa2] mb-1.5 font-bold flex items-center gap-1.5">
              <Lightbulb size={12} className="text-[#a4fca2]" /> Scenic Light Presets
            </span>
            <div className="flex gap-1.5" id="lighting-preset-selectors">
              {(['studio', 'neon', 'velvet', 'sunlight'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => updateLights(preset)}
                  className={`px-3 py-1.5 rounded text-[10px] uppercase tracking-wider rounded font-bold border transition-all ${
                    activePresetLighting === preset
                      ? 'bg-[#15341a] text-[#a4ffa2] border-[#a4ffa2] shadow-inner shadow-[#a4ffa2]/50'
                      : 'bg-white/5 text-[#9bb89a] border-white/5 hover:bg-white/10'
                  }`}
                  id={`preset-${preset}-btn`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visual guide markers */}
        <div className="absolute top-4 right-4 z-10 pointer-events-none" id="luxury-branding-stamps">
          <div className="text-right flex flex-col gap-0.5">
            <span className="text-[10px] tracking-[6px] uppercase font-bold text-[#a4ffa2] mb-0.5">Teenz Wearz Tryon v3.5</span>
            <span className="text-[9px] tracking-wider text-white/40 font-mono">Realistic Male Mannequin</span>
          </div>
        </div>

        {/* Interactive HUD instructions */}
        <div className="absolute right-4 bottom-4 pointer-events-none text-right hidden sm:block" id="mouse-hint-text">
          <span className="text-[10px] text-[#a4ffa2] uppercase tracking-wide flex items-center justify-end gap-1.5 font-bold">
            <Compass size={12} className="animate-spin-slow" /> Left click & slide mouse to rotate try-on figure
          </span>
        </div>
      </div>
    </div>
  );
}
