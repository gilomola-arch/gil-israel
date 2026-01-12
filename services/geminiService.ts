
import { GoogleGenAI, Type } from "@google/genai";
import { AIData, ScriptData } from "../types";

// Moved AI initialization inside functions to ensure fresh API key usage

export const generateViralHooks = async (topic: string): Promise<AIData> => {
  // Always initialize with fresh API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `צור 3 "הוקים" (Hooks) ויראליים לסרטון קצר (TikTok/Reels) בנושא: ${topic}. בנוסף, צרף אסטרטגיית תוכן קצרה.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hooks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                hook: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["hook", "explanation"]
            }
          },
          strategy: { type: Type.STRING }
        },
        required: ["hooks", "strategy"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateFullScript = async (hook: string, topic: string): Promise<ScriptData> => {
  // Always initialize with fresh API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `כתוב תסריט מלא לסרטון קצר המבוסס על ההוק: "${hook}" והנושא: "${topic}". התסריט צריך לכלול פתיחה, גוף וקריאה לפעולה (CTA).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          opening: { type: Type.STRING },
          body: { type: Type.STRING },
          cta: { type: Type.STRING }
        },
        required: ["opening", "body", "cta"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateThumbnailIdea = async (description: string): Promise<string> => {
  // Always initialize with fresh API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `A vibrant, eye-catching YouTube/TikTok thumbnail background for a video about: ${description}. Professional lighting, high contrast, clean space for text overlay.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

export const explainLessonConcepts = async (title: string, description: string): Promise<string> => {
  // Always initialize with fresh API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `אתה עוזר וירטואלי מומחה לתוכן ויראלי. הסבר בצורה פשוטה ומעמיקה את המושגים המרכזיים בשיעור הבא: 
    כותרת: ${title}
    תיאור: ${description}
    תן 3 טיפים מעשיים ליישום מיידי.`,
  });
  return response.text;
};

export const generateFullLessonContent = async (lessonTopic: string): Promise<{ title: string; description: string }> => {
  // Always initialize with fresh API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `צור תוכן מפורט לשיעור בקורס דיגיטלי בנושא: ${lessonTopic}. 
    השיעור מיועד ליוצרי תוכן מתחילים שרוצים להצליח בטיקטוק ואינסטגרם.
    התוצר צריך לכלול כותרת מושכת ותיאור מפורט הכולל:
    1. מה נלמד בשיעור.
    2. חשיבות הנושא.
    3. שלבים מעשיים ליישום.
    4. "שיעורי בית" לתלמידים.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ["title", "description"]
      }
    }
  });
  return JSON.parse(response.text);
};
