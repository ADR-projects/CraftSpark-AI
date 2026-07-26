const express = require('express');
const router = express.Router();
console.log("AI handler entrypoint!")
const Groq = require("groq-sdk");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config(); // load env var

console.log("before init ai")

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

console.log("Get the ai up and runnin'!")

router.get('/', (req, res) => {
  console.log("gen got!")
})

router.post("/", async (req, res) => {
  try {
    const { skills, themes, wantToTry, materials } = req.body;
    console.log("Post section")
    // This is the prompt

    console.log("Raw body:", req.body);

    const prompt = `
      You are CraftSpark-AI, a helpful DIY craft assistant.

      FIRST, evaluate the provided skills and materials. If they contain harmful, dangerous, impossible, or highly irrelevant items (e.g., "Uranium", "Wasting Time", "Plutonium", "Sleeping"), you MUST return this exact JSON error object and nothing else:
      { "error": "Invalid or inappropriate materials/skills provided. Please enter realistic craft materials and skills." }

      Otherwise, generate 4-8 creative craft/Art/DIY ideas as a CLEAN JSON object in this exact format:
      {
        "1": {
          "title": "...",
          "emoji": "...",
          "gradient": ["#...", "#..."]
        },
        "2": {...},
        "3": {...}
      }

      Use themes like: ${themes}.
      Maker's Skills: ${skills}.
      Materials available to the Maker: ${materials.join(", ")}.
      
      Craft title should be, maximum, around 5 words long.
      The "emoji" field MUST be a SINGLE highly relevant emoji (e.g., 🧶, 🎨, 🪵).
      The "gradient" field MUST be an array of EXACTLY TWO hex color codes representing a vibrant CSS gradient (e.g., ["#FF9A9E", "#FECFEF"]).
      
      Do NOT send in markdown format, or include commentary. Output ONLY valid JSON.
    `;

    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });
    console.log(response.choices[0].message.content);
    const text = response.choices[0].message.content;

    // parse the AI output as JSON
    let cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    let parsed;
    try {
      parsed = JSON.parse(cleanText);
    } catch (e) {
      console.error("Error parsing AI response:", e);
      return res.status(500).json({ error: "Failed to parse AI output" });
    }

    if (parsed.error) {
      return res.status(400).json({ error: parsed.error });
    }

    // No mapping needed, emoji and gradient are directly in the JSON from Groq


    // IMPORTANT:  HERE IS WHERE YOU PASS THE PARSED JSON 
    res.json({ craftsData: parsed });

  } catch (err) {
    if (err.message.includes("503")) {
      return res.status(503).json({
        error: "AI service is busy — please try again shortly!",
      });
    }
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });

  }
});





module.exports = router
