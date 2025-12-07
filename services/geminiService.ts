

import { GoogleGenAI, Type } from "@google/genai";
import { ColorPalette, PantoneMatch } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to generate color palettes
export const generateColorPalette = async (mood: string): Promise<ColorPalette[]> => {
  try {
    const model = 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
      model,
      contents: `Generate a professional UI color palette of 5 colors based on this mood/theme: "${mood}". 
      You MUST assign exactly one color to each of these roles: 'primary', 'secondary', 'accent', 'surface', 'text'.
      Ensure high contrast between 'surface' and 'text'.
      Return JSON with name, hex, description, and role.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              hex: { type: Type.STRING },
              description: { type: Type.STRING },
              role: { type: Type.STRING, enum: ['primary', 'secondary', 'accent', 'surface', 'text'] }
            },
            required: ['name', 'hex', 'description', 'role']
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as ColorPalette[];
  } catch (error) {
    console.error("Gemini Color Error:", error);
    throw error;
  }
};

interface TextOptions {
  template: string;
  tone: string;
  language: 'ar' | 'en';
}

// Helper to generate text copy
export const generateDesignCopy = async (prompt: string, options: TextOptions): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    let sysPrompt = `You are an expert copywriter and UX writer.`;
    sysPrompt += ` Target Language: ${options.language === 'ar' ? 'Arabic' : 'English'}.`;
    sysPrompt += ` Tone: ${options.tone}.`;
    sysPrompt += ` Format: ${options.template}.`;
    
    let contentPrompt = `Generate professional content based on this context: "${prompt}".\n`;
    
    if (options.template === 'headline') {
      contentPrompt += "Provide 3-5 catchy headline variations.";
    } else if (options.template === 'ux') {
      contentPrompt += "Provide short, clear microcopy for buttons, labels, or empty states related to the context.";
    } else if (options.template === 'product') {
      contentPrompt += "Write a compelling product description highlighting benefits.";
    } else {
      contentPrompt += "Provide high-quality copy suitable for a design mockup.";
    }

    const response = await ai.models.generateContent({
      model,
      contents: contentPrompt,
      config: {
        systemInstruction: sysPrompt
      }
    });

    return response.text || '';
  } catch (error) {
    console.error("Gemini Text Error:", error);
    throw error;
  }
};

// Helper to find Pantone Match
export const findPantoneMatch = async (hex: string): Promise<PantoneMatch> => {
  try {
    const model = 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
      model,
      contents: `Find the closest Pantone Matching System (PMS) Solid Coated color for this HEX code: ${hex}.
      Return the result as JSON including the PMS code, the official name (if any), the hex value of that PMS color, approximate CMYK values, and a brief description of how close the match is.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            code: { type: Type.STRING, description: "The PMS Code (e.g. PMS 123 C)" },
            name: { type: Type.STRING, description: "The color name (e.g. Daffodil)" },
            hex: { type: Type.STRING, description: "The HEX code of the Pantone color" },
            cmyk: { type: Type.STRING, description: "Approximate CMYK values (e.g. 0, 20, 100, 0)" },
            description: { type: Type.STRING, description: "Short description of the match accuracy" }
          },
          required: ['code', 'name', 'hex', 'cmyk', 'description']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text) as PantoneMatch;
  } catch (error) {
    console.error("Gemini Pantone Error:", error);
    throw error;
  }
};

// Helper to generate a logo using image generation model
export const generateLogo = async (prompt: string, style: string): Promise<string | null> => {
  try {
    const model = 'gemini-2.5-flash-image';
    
    // Construct a specific prompt for logo generation
    const fullPrompt = `Design a professional, high-quality vector-style logo. 
    Subject: ${prompt}.
    Style: ${style}. 
    Requirements: Clean lines, centered, white background, suitable for branding. 
    Ensure it looks like a finished logo asset.`;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
         imageConfig: {
            aspectRatio: "1:1"
         }
      }
    });

    // Check for inline data in response parts
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
         return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Gemini Logo Generation Error:", error);
    throw error;
  }
};