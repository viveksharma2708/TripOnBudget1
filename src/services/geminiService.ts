import { GoogleGenAI } from "@google/genai";
import { Package } from "../context/PackageContext";

export async function chatWithAI(message: string, packages: Package[], chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[]) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'undefined' || apiKey === '') {
      console.warn("[AI] Gemini API key NOT FOUND in environment.");
      return "Hi there! Our AI assistant is currently in light sleep mode. While I wake it up, feel free to browse our packages or message us directly on WhatsApp for instant support!";
    }

    // Safe debug check
    console.log(`[AI] Service initializing with key (length: ${apiKey.length})`);

    const ai = new GoogleGenAI({ apiKey });
    
    // Limit package context size to avoid token limits
    const packagesContext = packages.slice(0, 15).map(pkg => ({
      title: pkg.title,
      location: pkg.location,
      price: `₹${pkg.price}`,
      category: pkg.category,
    }));

    const systemInstruction = `
      You are the official digital concierge for "TripOnBudget", a premium travel agency.
      Tone: Professional, helpful, enthusiastic, and concise.
      
      Agency Info:
      - Specialization: Affordable luxury, domestic tours, spiritual journeys, and adventure trips.
      - HQ: Ballabgarh, Faridabad. 
      - Reach us: +91 78279 16794.
      
      Instructions:
      1. Keep responses under 3 sentences unless listing details.
      2. If a user asks about pricing, refer to the available packages.
      3. Always encourage booking or contacting via WhatsApp (+91 78279 16794) for custom needs.
      4. Do not mention "AI model" or "Gemini" in conversation unless asked about technology.
      
      Current Packages:
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
      throw new Error("Empty response from AI service");
    }

    return response.text;
  } catch (error) {
    console.error("[AI Service Error]:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes("API_KEY_INVALID") || errorMessage.includes("401")) {
      return "Our AI concierge is undergoing a quick security check. Please contact our human team on WhatsApp for immediate help!";
    }

    if (errorMessage.includes("quota") || errorMessage.includes("429")) {
      return "Wow, a lot of travelers are planning today! I'm taking a 30-second breather. Please try again or reach us on WhatsApp.";
    }
    
    return "I'm having a slight connection interruption. Our team at TripOnBudget is ready to help you on WhatsApp (+91 78279 16794) right now!";
  }
}
