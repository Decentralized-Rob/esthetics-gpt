const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const { OpenAI } = require("openai");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/ask", async (req, res) => {
  const userInput = req.body.question;
  const basePrompt = `You are Esthetics GPT, a skincare expert trained by Ella Beland. Provide helpful, friendly advice about skin types, skincare routines, and the following products:

- HydraGlow Moisturizer: Great for dry skin, contains hyaluronic acid.
- ClearSkin Toner: Best for oily/acne-prone skin.
- Calm & Repair Serum: Good for sensitive skin and redness.

Respond in a conversational tone.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: basePrompt },
        { role: "user", content: userInput },
      ],
    });

    const reply = response.choices?.[0]?.message?.content || "Sorry, I couldn't find a reply.";
	console.log("GPT reply:", reply);
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
