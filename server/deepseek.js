const axios = require('axios');

// Utility to clean and extract usable HTML from model output
const extractHTML = (text) => {
  if (!text || typeof text !== "string") return "";

  text = text.trim();

  // Remove code fences if wrapped in markdown-style ```
  const markdownRegex = /^```(?:html)?\n?([\s\S]*?)\n?```$/i;
  const match = text.match(markdownRegex);
  if (match) {
    text = match[1].trim();
  }

  // Start from <!DOCTYPE html>
  const doctypeIndex = text.indexOf("<!DOCTYPE html>");
  if (doctypeIndex !== -1) return text.slice(doctypeIndex).trim();

  // Fallback: start from <html>
  const htmlIndex = text.indexOf("<html");
  if (htmlIndex !== -1) return text.slice(htmlIndex).trim();

  // Return as-is if no marker found
  return text;
};

// Main generator function
const generateFromDeepSeek = async (prompt) => {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error("❌ DEEPSEEK_API_KEY not found in .env");
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      // "https://api.deepseek.com/v1/chat/completions",
      {
        // model: "deepseek-chat",
        model:"deepseek/deepseek-r1-0528:free" ,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 20000, // 20 seconds max wait time
      }
    );

    const content = response.data?.choices?.[0]?.message?.content || "";

    console.log("✅ DeepSeek response received");

    return extractHTML(content);

  } catch (err) {
    console.error("❌ DeepSeek API Error:", err?.response?.data || err.message);
    throw new Error("Failed to generate HTML from DeepSeek");
  }
};

module.exports = generateFromDeepSeek;
