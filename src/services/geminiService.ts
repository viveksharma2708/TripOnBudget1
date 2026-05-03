import { GoogleGenAI } from "@google/genai";
import { Package } from "../context/PackageContext";

export async function chatWithAI(message: string, packages: Package[], chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[]) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
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
      model: "gemini-3-flash-preview",
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
    console.error("Gemini AI Client Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("API key not valid") || errorMessage.includes("API_KEY_INVALID")) {
      return "The Gemini API key is invalid. Please go to Settings (gear icon) and ensure GEMINI_API_KEY is correctly configured.";
    }
    if (errorMessage.includes("quota") || errorMessage.includes("rate limit") || errorMessage.includes("429")) {
      return "I'm receiving too many requests right now. Please wait a moment and try again.";
    }
    return "I'm sorry, I'm having trouble connecting right now. Please try again or contact us directly.";
  }
}
