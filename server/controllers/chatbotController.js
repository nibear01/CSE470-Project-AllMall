const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Initialize the Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Chatbot controller
 * Expects JSON: { input: "user message" }
 */
const chatWithBot = async (req, res) => {
  const userInput = req.body.input;

  if (!userInput || userInput.trim() === "") {
    return res.status(400).json({ error: "Input is required" });
  }

  try {
    // Get the Gemini model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      }
    });

    // Create a prompt with context about your e-commerce store
    const prompt = `
      You are ShopEase, a helpful AI shopping assistant for AllMall, an e-commerce platform.
      Your role is to assist customers with:
      - Product recommendations
      - Order status inquiries
      - Shipping information
      - Return policies
      - General shopping questions
      
      Be friendly, concise, and helpful. If you don't know something, politely say so.
      
      Customer question: ${userInput}
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const botReply = response.text();

    res.json({ reply: botReply.trim() });
  } catch (err) {
    console.error("AI request failed:", err);
    res.status(500).json({ error: "AI request failed. Please try again later." });
  }
};

module.exports = { chatWithBot };