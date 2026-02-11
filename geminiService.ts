
import { GoogleGenAI } from "@google/genai";

export const askAboutPlanet = async (planetName: string, question: string) => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    return "שגיאה: מפתח ה-API לא מזוהה. ודאו שהגדרתם API_KEY ב-Environment Variables ב-Vercel וביצעתם Redeploy.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a world-class planetary scientist. The user is exploring a solar system simulation in Hebrew. 
      The current planet is ${planetName}. Answer the question in Hebrew.
      Question: ${question}`,
      config: {
        systemInstruction: "ענה בעברית בלבד בצורה מרתקת ומדעית. הגבל את התשובה ל-3 משפטים. השתמש במטפורות מעולם המושגים של בני אדם כדי להסביר גדלים ומרחקים.",
        temperature: 0.8,
      }
    });
    
    return response.text || "מצטער, לא הצלחתי לעבד את התשובה.";
  } catch (error: any) {
    console.error("Gemini error:", error);
    return "חלה שגיאה בתקשורת עם הבינה המלאכותית. ודאו שהמפתח תקין ושיש חיבור לאינטרנט.";
  }
};
