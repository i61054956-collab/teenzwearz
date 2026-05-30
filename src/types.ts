/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GarmentUpperType = 'shirt' | 'tshirt' | 'hoodie' | 'suit' | 'gown' | 'crop_top' | 'cloak';
export type GarmentLowerType = 'jeans' | 'pants' | 'shorts' | 'skirt_flared' | 'skirt_pleated' | 'gown_long';
export type GarmentSleeveType = 'sleeveless' | 'short' | 'long' | 'puff' | 'wing';
export type GarmentCollarType = 'classic' | 'turtleneck' | 'v_neck' | 'off_shoulder' | 'hood';
export type GarmentPatternType = 'solid' | 'stripes' | 'grid' | 'dots' | 'holographic' | 'floral_brocade';

export interface GarmentConfig {
  upperType: GarmentUpperType;
  lowerType: GarmentLowerType;
  sleeveType: GarmentSleeveType;
  collarType: GarmentCollarType;
  primaryColor: string;
  accentColor: string;
  pattern: GarmentPatternType;
  patternScale: number;
  patternColor: string;
  roughness: number; // 0 to 1
  metalness: number; // 0 to 1
  glowStrength: number; // 0 to 10
  glowColor: string;
  itemScaleX: number; // fit / tightness x-axis
  itemScaleY: number; // fit / jacket length y-axis
  faceImageUrl?: string; // Optional user uploaded face
}

export interface FashionDesign {
  id: string;
  name: string;
  description: string;
  inspiration: string;
  accessories: string[];
  tags: string[];
  config: GarmentConfig;
  isCustom?: boolean;
  createdAt?: string;
  aiPrompt?: string;
}

export type SceneLightingPreset = 'studio' | 'neon' | 'velvet' | 'daylight' | 'stage';
