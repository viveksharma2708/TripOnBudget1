import { GoogleGenAI } from "@google/genai";
import { Package } from "../context/PackageContext";

export async function chatWithAI(message: string, packages: Package[], chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[]) {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');
    
    if (!apiKey) {
      console.warn("Gemini API key missing.");
      return "I'm sorry, my AI features are currently offline because the API key is not configured.";
    }

    const ai = new GoogleGenAI({ apiKey });
    const packagesContext = packages.map(pkg => ({
      title: pkg.title,
      location: pkg.location,
      duration: pkg.duration,
      price: pkg.price,
      groupPrice: pkg.groupPrice,
      singlePrice: pkg.singlePrice,
      description: pkg.description,
      itineraryCount: pkg.itinerary.length,
      category: pkg.category,
      date: pkg.packageDate
    }));

    const systemInstruction = `
      You are a concierge for "TripOnBudget". 
      Keep responses extremely concise and direct. Respond ONLY to what is asked. 
      If a user asks "How are you?", reply briefly like "I'm doing well, thank you! How can I help you today?".
      Avoid long introductions or unnecessary details unless specifically requested.
      
      Website Context:
      - We offer Domestic, Adventure, Spiritual, and Weekend travels.
      - Office: Ballabgarh, Faridabad. Phone: +91 78279 16794.
      
      Available Packages:
      ${JSON.stringify(packagesContext, null, 2)}
      
      Guidelines:
      - Suggest specific packages only if relevant to the query.
      - Be professional but brief.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again or contact us directly.";
  }
}
