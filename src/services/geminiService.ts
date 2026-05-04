import { GoogleGenAI } from "@google/genai";
import { Package } from "../context/PackageContext";

export async function chatWithAI(message: string, packages: Package[], chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[]) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn("Gemini API key is not configured in the environment.");
      return "I'm sorry, my AI features are currently offline because the API key is not configured. Please reach out to us on WhatsApp!";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const packagesContext = packages.map(pkg => ({
      title: pkg.title,
      location: pkg.location,
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
        systemInstruction,
        temperature: 0.7,
      }
    });

    if (!response || !response.text) {
      throw new Error("Empty response from Gemini AI");
    }

    return response.text;
  } catch (error) {
    console.error("Gemini AI Detail Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes("API_KEY_INVALID")) {
      return "There's an authentication issue with the AI service. Please contact us on WhatsApp while we fix it!";
    }
    
    return "I'm having trouble connecting right now. Please try again or reach out to us on WhatsApp for immediate assistance!";
  }
}
