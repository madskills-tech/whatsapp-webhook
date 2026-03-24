const express = require("express");
const app = express();

app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Server chal raha hai 🚀");
});

// 🔐 Webhook verification (GET)
const VERIFY_TOKEN = "mytoken";

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// 📩 Webhook receive messages (POST)
app.post("/webhook", (req, res) => {
  console.log("Webhook hit:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));