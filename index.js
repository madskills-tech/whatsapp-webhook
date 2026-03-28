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

    const reply = "Hello 👋 Thanks for messaging,Pls send us your inquiry And one of Our agent will be in touch with you shortly!";

    try {
      await fetch("https://graph.facebook.com/v18.0/959309777275020/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer EAALWwvfLWxcBRJweP85HjZAD9U2ZCHNOJASAzLSTJFAqqQcRpCEOAo6t27emdZAxQDtIwmUIchjKZAVYwLVxKRcfJ537y2oqbhZArgJnKE7tBew5hUdWCudgT9RU3tLmLT4rU340JEWZBDtG6hz6iYi4r8W18ZB9s7zwZC7xslO6DFj3pen6MfdlJQojXehy3Kn8JxTUqznkJHJKDFwrdBpreTnTk6ZCYBZAODZB74YZCa0V84WKvB1k3x4UYTGRlH7UYtLnU0MZBH8UamLZAAnV4K4lwxnBaI"
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
