import { GoogleGenAI } from "@google/genai";

export const askAboutPlanet = async (planetName: string, question: string) => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    return "המפתח של הבינה המלאכותית (API_KEY) לא הוגדר. יש להגדיר אותו ב-Environment Variables ב-Vercel.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a planetary scientist expert. The user is exploring a solar system simulation in Hebrew. 
      The user is currently looking at ${planetName}. 
      Answer the following question in Hebrew concisely and engagingly: ${question}`,
      config: {
        systemInstruction: "ענה בעברית בלבד. היה מדויק מדעית אך מונגש לקהל הרחב. שמור על תשובות קצרות. אם שואלים על סדרי גודל, הסבר בעזרת דוגמאות מחיי היום יום.",
        temperature: 0.7,
      }
    });
    return response.text || "מצטער, לא הצלחתי למצוא תשובה כרגע.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return "חלה שגיאה בחיבור לבינה המלאכותית. וודאי שהמפתח הוגדר כראוי ב-Vercel.";
  }
};