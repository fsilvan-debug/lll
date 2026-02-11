import { GoogleGenAI } from "@google/genai";

export const askAboutPlanet = async (planetName: string, question: string) => {
  // Use the key injected by Vite from process.env
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    return "המפתח (API_KEY) לא הוגדר. יש להוסיף אותו ב-Vercel Settings ולבצע Redeploy.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a planetary scientist expert. Answer about ${planetName} in Hebrew. Question: ${question}`,
      config: {
        systemInstruction: "ענה בעברית בלבד. היה מדויק מדעית. תשובות קצרות וקולעות.",
        temperature: 0.7,
      }
    });
    return response.text || "לא הצלחתי לקבל תשובה.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return "שגיאה בחיבור לבינה המלאכותית. וודאו שהמפתח ב-Vercel הוגדר כראוי.";
  }
};