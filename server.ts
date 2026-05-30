/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isProd = process.env.NODE_ENV === 'production';
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client to prevent startup crashes when API key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      throw new Error('GEMINI_API_KEY environment variable is not configured in Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// AI Endpoint: Procedural Design Generator
app.post('/api/design', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Inspiration prompt is required.' });
      return;
    }

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Design a premium, luxury outfit configuration inspired by: "${prompt}". Keep the style high-end, elegant, and cinematic, keeping in theme with Teenz Wearz's luxurious branded clothing.`,
      config: {
        systemInstruction: `You are an elite, avant-garde digital fashion designer for "Teenz Wearz", a luxury factory-direct custom garment warehouse.
Given a design prompt or mood description, output a comprehensive procedural 3D model configuration.
Strictly output a valid JSON matching the schema format. Be creative with custom colors (hex, e.g., #2d5a27), metallic parameters (silk/wool vs leather/heavy metals), and emissive glow values (ideal for cyberpunk high-tech details). Ensure uppercase hex colors like "#124D3E".`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['name', 'description', 'inspiration', 'accessories', 'tags', 'config'],
          properties: {
            name: {
              type: Type.STRING,
              description: 'An elegant, high-end title for this garment line (e.g. "Emerald Royal Brocade Blazer" or "Midnight Velvet Drape").'
            },
            description: {
              type: Type.STRING,
              description: 'A 2-sentence luxurious editorial style product description.'
            },
            inspiration: {
              type: Type.STRING,
              description: 'A short sentence summarizing the mood or aesthetic statement (e.g. "A classic combination of 8s retro and traditional tailoring").'
            },
            accessories: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List 2-4 recommended luxury accessories to style this with (e.g., "Silver lapel pin", "Minimalist leather loafers").'
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 styling keywords (e.g. "Avant-Garde", "Corporate Noir", "High-Contrast").'
            },
            config: {
              type: Type.OBJECT,
              required: [
                'upperType', 'lowerType', 'sleeveType', 'collarType',
                'primaryColor', 'accentColor', 'pattern', 'patternScale',
                'patternColor', 'roughness', 'metalness', 'glowStrength',
                'glowColor', 'itemScaleX', 'itemScaleY'
              ],
              properties: {
                upperType: {
                  type: Type.STRING,
                  enum: ['tshirt', 'suit', 'gown', 'shirt', 'crop_top', 'cloak'],
                  description: 'Type of top'
                },
                lowerType: {
                  type: Type.STRING,
                  enum: ['pants', 'skirt_flared', 'skirt_pleated', 'gown_long', 'shorts'],
                  description: 'Type of bottom'
                },
                sleeveType: {
                  type: Type.STRING,
                  enum: ['sleeveless', 'short', 'long', 'puff', 'wing'],
                  description: 'Sleeve style'
                },
                collarType: {
                  type: Type.STRING,
                  enum: ['v_neck', 'turtleneck', 'classic', 'off_shoulder'],
                  description: 'Collar opening style'
                },
                primaryColor: {
                  type: Type.STRING,
                  description: 'Primary fabric color in Hex format starting with #'
                },
                accentColor: {
                  type: Type.STRING,
                  description: 'Accent details / linings color in Hex format starting with #'
                },
                pattern: {
                  type: Type.STRING,
                  enum: ['solid', 'stripes', 'grid', 'dots', 'holographic', 'floral_brocade'],
                  description: 'Procedural fabric texture layer'
                },
                patternScale: {
                  type: Type.NUMBER,
                  description: 'Texture density multiplier: any float between 0.5 and 8.0'
                },
                patternColor: {
                  type: Type.STRING,
                  description: 'Contrast pattern color in Hex format starting with #'
                },
                roughness: {
                  type: Type.NUMBER,
                  description: 'Material roughness factor: 0.0 (smooth gloss) to 1.0 (ultra-matte)'
                },
                metalness: {
                  type: Type.NUMBER,
                  description: 'Material metalness factor: 0.0 (cotton/silk fibers) to 1.0 (plate/chrome/reflective threads)'
                },
                glowStrength: {
                  type: Type.NUMBER,
                  description: 'Emissive neon glow coefficient of trim details: float from 0.0 (no glow) up to 8.0'
                },
                glowColor: {
                  type: Type.STRING,
                  description: 'Trim glow color in Hex format starting with #'
                },
                itemScaleX: {
                  type: Type.NUMBER,
                  description: 'Horizontal fit coefficient (tightness): positive float between 0.85 (slim) and 1.35 (oversized/boxed)'
                },
                itemScaleY: {
                  type: Type.NUMBER,
                  description: 'Vertical fit coefficient (length): positive float between 0.80 (crop/shortened) and 1.30 (overcoat/long)'
                }
              }
            }
          }
        }
      }
    });

    const textOutput = response.text?.trim() || '{}';
    const parsedData = JSON.parse(textOutput);
    res.json(parsedData);
  } catch (error: any) {
    console.error('Gemini error:', error);
    res.status(500).json({
      error: 'Failed to generate custom style composition.',
      details: error.message || error,
      needsKey: !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY'
    });
  }
});

// Configure client environment parameters endpoint
app.get('/api/config', (req, res) => {
  res.json({
    hasApiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY',
  });
});

if (isProd) {
  // Serve production build files
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // Use Vite development server middleware
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Teenz Wearz Server] Running at http://localhost:${PORT}`);
});
