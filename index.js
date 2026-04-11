const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

// 🔥 CONFIG (IMPORTANT)
const ACCESS_TOKEN = "EAALWwvfLWxcBRF4weXt7YXQhCo1KwLJnqZCeTHLX5gTcfBRZBT5FnPFvyoZBZAOmptb8O6kO52Yqwr7qq3Q7bA1zvxCpHTbKC4cv5Tz7ioRqwe8tcI2wIn1CJayKgzkWfR3wjnzbqXA3btBrZCD3eygyZBP9Bxqyr1ZCmY3EZCHlP5jyZA5HRmwpEegRf6NwJBoyYBTxDqbKuLxOjy0kcx4wzPuzzXpWxt6zW4qYIfxTUVPUQFErWlehjACTB1OYjC7ZB8ey8xxdlcVHZAY2kDL65CsOvdy";
const PHONE_NUMBER_ID = "959309777275020";

// 🔗 MongoDB
mongoose.connect("mongodb+srv://skillsservicesdxb_db_user:7wHegUk0hWXtVBiy@cluster0.9f6r6ts.mongodb.net/?appName=Cluster0")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// 📦 Schema
const Message = mongoose.model(
  "Message",
  new mongoose.Schema({
    from: String,
    message: String,
    timestamp: Date
  })
);

app.use(cors());
app.use(express.json());

// ================= WEBHOOK (AUTO REPLY) =================
app.post("/webhook", async (req, res) => {
  console.log("Webhook hit:", JSON.stringify(req.body, null, 2));

  const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (message) {
    const from = message.from;
    const text = message.text?.body || "non-text";

    await Message.create({
      from: from,
      message: text,
      timestamp: new Date()
    });

    console.log("Saved in DB:", text);

    const reply = "Hello 👋 Thanks for messaging, Please send your inquiry. Our agent will contact you shortly!";

    try {
      const response = await fetch(`https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          text: { body: reply }
        })
      });

      const data = await response.json();
      console.log("Auto Reply Response:", data);

    } catch (err) {
      console.log("Auto Reply Error:", err);
    }
  }

  res.sendStatus(200);
});

// ================= GET MESSAGES =================
app.get("/messages", async (req, res) => {
  const messages = await Message.find().sort({ timestamp: -1 });
  res.json(messages);
});

// ================= MANUAL REPLY (FIXED 🔥) =================
app.post("/reply", async (req, res) => {
  try {
    const { to, message } = req.body;

    console.log("Manual Reply:", to, message);

    if (!to || !message) {
      return res.status(400).json({ error: "Missing to/message" });
    }

    const response = await fetch(`https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to,
        text: { body: message }
      })
    });

    const data = await response.json();
    console.log("Manual Send Response:", data);

    res.json(data);

  } catch (err) {
    console.error("Manual Send Error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// ================= SERVER =================
app.listen(10000, () => {
  console.log("Server running on port 10000");
});
