

import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ColorPalette, PantoneMatch } from "../types";

// Note: For video generation with Veo, we re-instantiate GoogleGenAI 
// inside the function to pick up the user-selected key from process.env.API_KEY

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
    
    let sysPrompt = `You are an expert copywriter, marketer, and UX writer.`;
    sysPrompt += ` Target Language: ${options.language === 'ar' ? 'Arabic' : 'English'}.`;
    sysPrompt += ` Tone: ${options.tone}.`;
    sysPrompt += ` Format: ${options.template}.`;
    
    let contentPrompt = `Generate professional content based on this context/input: "${prompt}".\n`;
    
    // Existing Templates
    if (options.template === 'headline') {
      contentPrompt += "Provide 3-5 catchy headline variations.";
    } else if (options.template === 'ux') {
      contentPrompt += "Provide short, clear microcopy for buttons, labels, or empty states related to the context.";
    } else if (options.template === 'product') {
      contentPrompt += "Write a compelling product description highlighting benefits.";
    } 
    // Marketing Specific Templates
    else if (options.template === 'instagram') {
        contentPrompt += "Write an engaging Instagram caption with emojis and relevant hashtags. Ensure it encourages interaction.";
    } else if (options.template === 'ad_short') {
        contentPrompt += "Write a punchy, short ad copy focused on conversion and call to action.";
    } else if (options.template === 'headlines_catchy') {
        contentPrompt += "Generate 5 viral-worthy, catchy headlines designed to grab attention immediately.";
    } else if (options.template === 'offer_discount') {
        contentPrompt += "Draft a compelling special offer or discount announcement. Create a sense of urgency and value.";
    }
    else {
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

// Competitor Analysis with Grounding
export interface CompetitorAnalysisResult {
    strengths: string[];
    weaknesses: string[];
    marketing_style: string;
    audience: string;
    best_content: string;
}

export const analyzeCompetitor = async (url: string, notes: string, lang: 'ar' | 'en' = 'ar'): Promise<CompetitorAnalysisResult> => {
    try {
        const model = 'gemini-2.5-flash'; // Flash supports search grounding
        const response = await ai.models.generateContent({
            model,
            contents: `Analyze the following competitor brand/store/account found at this URL: ${url}. 
            Additional Context: ${notes}.
            
            Use Google Search to find the most recent information, social media presence, and customer reviews about them.
            
            Provide a detailed competitive analysis in ${lang === 'ar' ? 'Arabic' : 'English'}.
            
            RETURN A RAW JSON OBJECT (do not wrap in markdown code blocks) with the following structure:
            {
              "strengths": ["string", "string"],
              "weaknesses": ["string", "string"],
              "marketing_style": "string",
              "audience": "string",
              "best_content": "string"
            }`,
            config: {
                tools: [{ googleSearch: {} }],
                // Note: responseMimeType: "application/json" and responseSchema are NOT supported when using tools like googleSearch.
                // We rely on the prompt to request JSON output.
            }
        });

        let text = response.text;
        if (!text) throw new Error("No analysis generated");
        
        // Cleanup potential markdown formatting
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(text) as CompetitorAnalysisResult;
    } catch (error) {
        console.error("Competitor Analysis Error:", error);
        throw error;
    }
}

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
export const generateLogo = async (prompt: string, style: string, brandText: string = ''): Promise<string | null> => {
  try {
    // Upgraded to Gemini 3 Pro Image (Banana Pro) for best quality
    const model = 'gemini-3-pro-image-preview';
    
    // IMPORTANT: Create a new instance to capture the latest API Key from window.aistudio selection
    // The guidelines specify users MUST select their own key for this model.
    const imageAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Construct a specific prompt for logo generation
    let fullPrompt = `Design a high-quality, professional vector-style logo.
    Subject: ${prompt}
    Style: ${style}
    
    Requirements:
    - Clean lines, centered, white background.
    - Professional corporate identity quality.
    - High contrast and scalable design.
    `;

    if (brandText.trim()) {
        fullPrompt += `
        BRAND NAME TEXT INSTRUCTION:
        - The logo MUST prominently feature the text: "${brandText}".
        - If the brand name is in Arabic ("${brandText}"), ensure the Arabic calligraphy is correct, legible, and follows standard Arabic writing rules (right-to-left, correct letter connections).
        - Integrate the text seamlessly into the logo design.
        `;
    }

    const response = await imageAi.models.generateContent({
      model,
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
         imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K" // Supported by Pro
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

interface VideoConfig {
  aspectRatio: '16:9' | '9:16';
  resolution: '720p' | '1080p';
}

// Updated generateVideo to support Image-to-Video
export const generateVideo = async (
    prompt: string, 
    config: VideoConfig, 
    image?: { data: string, mimeType: string }
): Promise<string | null> => {
    // IMPORTANT: Create a new instance to capture the latest API Key from window.aistudio selection
    const veoAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
        // Prepare request parameters with strict validation
        const params: any = {
            model: 'veo-3.1-fast-generate-preview',
            config: {
                numberOfVideos: 1,
                // Ensure defaults to valid enum values if undefined
                resolution: config.resolution || '720p',
                aspectRatio: config.aspectRatio || '16:9'
            }
        };

        // If prompt is provided and valid, add it
        if (prompt && prompt.trim().length > 0) {
            params.prompt = prompt.trim();
        }

        // If image is provided, add it (Image-to-Video)
        if (image) {
            params.image = {
                imageBytes: image.data,
                mimeType: image.mimeType
            };
        }

        // Veo requires at least a prompt OR an image.
        if (image && !params.prompt) {
            params.prompt = "Animate this image";
        }
        
        // Final check
        if (!params.image && !params.prompt) {
            throw new Error("A text prompt is required for video generation when no image is uploaded.");
        }

        let operation = await veoAi.models.generateVideos(params);

        // Polling loop
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
            operation = await veoAi.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) return null;
        
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!response.ok) throw new Error("Failed to fetch video bytes");
        
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error("Veo Video Generation Error:", error);
        throw error;
    }
};

// New Helper for Image Editing (Remove BG, Product Shot, etc.)
export const editImage = async (
    imageData: string, 
    mimeType: string, 
    prompt: string
): Promise<string | null> => {
    try {
        const model = 'gemini-2.5-flash-image';
        
        const response = await ai.models.generateContent({
            model,
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: imageData,
                            mimeType: mimeType
                        }
                    },
                    { text: prompt }
                ]
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData && part.inlineData.data) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Gemini Image Edit Error:", error);
        throw error;
    }
};

// --- SPECIAL TOOLS FUNCTIONS ---

export interface ChatConfig {
  mode: 'pro' | 'flash' | 'search' | 'maps' | 'think';
}

export const sendChatMessage = async (message: string, config: ChatConfig, history: any[] = []) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let model = 'gemini-3-pro-preview';
  let requestConfig: any = {};
  let tools: any[] = [];

  switch (config.mode) {
    case 'flash':
      model = 'gemini-2.5-flash-lite-latest'; // Fast
      break;
    case 'search':
      model = 'gemini-2.5-flash';
      tools = [{ googleSearch: {} }];
      break;
    case 'maps':
      model = 'gemini-2.5-flash';
      tools = [{ googleMaps: {} }];
      break;
    case 'think':
      model = 'gemini-3-pro-preview';
      requestConfig.thinkingConfig = { thinkingBudget: 16000 }; // Budget for thinking
      break;
    case 'pro':
    default:
      model = 'gemini-3-pro-preview';
      break;
  }

  if (tools.length > 0) {
    requestConfig.tools = tools;
  }

  try {
    const chatSession = ai.chats.create({
      model: model,
      history: history,
      config: requestConfig
    });

    const response = await chatSession.sendMessage({ message });
    return response; // Return full response object to access grounding metadata
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};

export const analyzeMedia = async (fileBase64: string, mimeType: string, prompt: string, isVideo: boolean) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview'; // Powerful model for vision/video

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              data: fileBase64,
              mimeType: mimeType
            }
          },
          { text: prompt || (isVideo ? "Analyze this video in detail." : "Analyze this image in detail.") }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Media Analysis Error:", error);
    throw error;
  }
};

export const generateSpeech = async (text: string) => {
    // Note: Re-instantiate to ensure key is fresh
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: { parts: [{ text }] },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        
        // Extract base64 audio
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio;
    } catch (error) {
        console.error("TTS Error:", error);
        throw error;
    }
};

export const transcribeAudio = async (audioBase64: string, mimeType: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    { inlineData: { data: audioBase64, mimeType: mimeType } },
                    { text: "Transcribe this audio exactly as spoken." }
                ]
            }
        });
        return response.text;
    } catch (error) {
        console.error("Transcription Error:", error);
        throw error;
    }
};