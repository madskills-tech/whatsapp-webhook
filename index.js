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
          Authorization: "Bearer EAALWwvfLWxcBRC4q7QYkvHieBraljc963nC5xTywZCnBGY5lMSyyrtwZBi8UErrbjYgIUOZA3BYEuLyQLWIN1LR4wSlzXfmZCZCg4LEV3Ye8pjHmX9OS87KtzQgFSIkKIODAeEZCSNvOXI4ZBwj6IU0NbuuM1nmxmfgqrRLZCLFn49JyLSqogbAt0VZAlviUVhZCYfZBFgu8TZCLPNwZCygBF9z9lyoOaCN5dhHIDRK0lIUvJdZBzz9r4zVSZBvxN52gebXrmIDwRofLxCKGWqbOr9J04sR1MeS"
       },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          text: { body: reply },
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
