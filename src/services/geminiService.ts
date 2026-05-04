import { GoogleGenAI } from "@google/genai";
import { Package } from "../context/PackageContext";

export async function chatWithAI(message: string, packages: Package[], chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[]) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const packagesContext = packages.map(pkg => ({
      title: pkg.title,
      location: pkg.location,
      duration: pkg.duration,
      price: pkg.price,
      description: pkg.description,
      category: pkg.category,
    }));

    const systemInstruction = `
      You are a concierge for "TripOnBudget". 
      Keep responses extremely concise and direct. Respond ONLY to what is asked. 
      Website Context:
      - We offer Domestic, Adventure, Spiritual, and Weekend travels.
      - Office: Ballabgarh, Faridabad. Phone: +91 78279 16794.
      
      Available Packages:
      ${JSON.stringify(packagesContext, null, 2)}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "I'm having trouble connecting right now. Please try again or reach out to us on WhatsApp!";
  }
}
