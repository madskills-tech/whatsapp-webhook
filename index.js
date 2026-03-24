const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server chal raha hai 🚀");
});

// ✅ ADD THIS
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "mytoken";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// existing POST
app.post("/webhook", (req, res) => {
  console.log(req.body);
  res.send("Webhook received");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});