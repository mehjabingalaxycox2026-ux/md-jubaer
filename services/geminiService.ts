
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function extractTicketData(emailContent: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract bus ticket issuance data from the following email text. 
      Email Content: "${emailContent}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            date: {
              type: Type.STRING,
              description: "The date of ticket issuance in YYYY-MM-DD format.",
            },
            ticketCount: {
              type: Type.NUMBER,
              description: "Number of tickets issued.",
            },
            rate: {
              type: Type.NUMBER,
              description: "The commission rate per ticket. Usually 50 or 100.",
            },
            subject: {
              type: Type.STRING,
              description: "A short descriptive subject for this entry.",
            }
          },
          required: ["date", "ticketCount", "rate"]
        }
      }
    });

    const json = JSON.parse(response.text);
    return json;
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw error;
  }
}
