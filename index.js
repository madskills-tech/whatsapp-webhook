const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://skillsservicesdxb_db_user:7wHegUk0hWXtVBiy@cluster0.9f6r6ts.mongodb.net/?appName=Cluster0")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));
const Message = mongoose.model(
  "Message",
  new mongoose.Schema({
    from: String,
    message: String,
    timestamp: Date
  })
);
const express = require("express");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

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

    const reply = "Hello 👋 Thanks for messaging!";

    try {
      await fetch("https://graph.facebook.com/v18.0/959309777275020/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer EAALWwvfLWxcBRDKOQCvzyXtJcTarmRny202UPiempWOlhqlScRwsiiDX5Qb0LbAQJ5ZCKRm5YwiQqY5zJmdhJXof2l1BKldJ5iRDfp2tJSa8hoynYiSM3sHtfuoSy4l5HXlIPyseRsZBq4sCHcAZApZCxXZBwGkVodjycnagJyZCF6k6t5WlDUDjnS4Ajmbm3wGejnzFvrP3ZAqEZB3SEdUcOWaAcm21rZA9YSKugwrxKmtL22NxCo6ZBv7AZA9TKLnreBlGTj6VaIJWAhfISPSYZC31CDz3"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to,
          text: { body: message },
        }),
      });

      console.log("Reply sent ✅");
    } catch (err) {
      console.log("Error:", err);
    }
  }

  res.sendStatus(200);
});

app.get("/messages", async (req, res) => {
  const messages = await Message.find().sort({ timestamp: -1 });
  res.json(messages);
});
app.post("/reply", async (req, res) => {
  const { to, message } = req.body;

  console.log("Reply:", to, message);

  // 👉 yaha tera WhatsApp API call aayega
  // abhi ke liye test response
  res.json({ success: true });
});
app.listen(10000, () => {
  console.log("Server running on port 10000");
});
