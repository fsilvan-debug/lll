
import { GoogleGenAI } from "@google/genai";

export const askAboutPlanet = async (planetName: string, question: string) => {
  // המפתח נמשך אוטומטית ממשתני הסביבה (Environment Variables)
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined") {
    return "המפתח (API_KEY) לא הוגדר כראוי ב-Vercel. יש להגדיר אותו ב-Settings -> Environment Variables ולבצע Redeploy.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a planetary scientist expert. The user is exploring a solar system simulation.
      The planet being discussed is: ${planetName}.
      Answer the following question in Hebrew concisely (max 3 sentences): ${question}`,
      config: {
        systemInstruction: "ענה בעברית בלבד. היה מדויק מדעית. אם השאלה היא על סדרי גודל, השתמש בדוגמאות מחיי היום יום.",
        temperature: 0.7,
      }
    });
    
    return response.text || "מצטער, לא הצלחתי למצוא תשובה כרגע.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return "חלה שגיאה בחיבור לבינה המלאכותית. ודאו שהמפתח הוגדר כראוי ב-Vercel (חובה לעשות Redeploy אחרי הגדרת המפתח).";
  }
};
