// ✅ Load environment variables
require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const generateFromDeepSeek = require('./deepseek');

const app = express();
const server = http.createServer(app);

// ✅ Confirm DEEPSEEK_API_KEY is loaded
if (!process.env.DEEPSEEK_API_KEY) {
  console.error("❌ DEEPSEEK_API_KEY is missing from .env");
  process.exit(1); // Stop the server if the key is missing
}

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// ✅ Handle socket events
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("generate", async (profile) => {
    try {
      const prompt = `
You are an expert Tailwind CSS web designer.

Create a modern, responsive landing page using **only Tailwind CSS utility classes** (no inline styles or <style> tags) for the following brand:

${JSON.stringify(profile, null, 2)}

Use the following Tailwind CDN link inside <head> of the HTML document:
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">

Use the provided logo if available (base64 or URL): ${profile.logoUrl || "N/A"}.

Return a complete HTML document starting with <!DOCTYPE html>.
Do not include markdown or explanations — only raw HTML output.
      `.trim();

      console.log("📤 Sending prompt to DeepSeek...");
      const html = await generateFromDeepSeek(prompt);

      socket.emit("generatedCode", {
        html,
        prompt,
      });

    } catch (error) {
      console.error("❌ Generation error:", error.message);
      socket.emit("generatedCode", {
        html: "<h1>⚠️ Error generating content</h1>",
        prompt: "Failed due to backend error.",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
