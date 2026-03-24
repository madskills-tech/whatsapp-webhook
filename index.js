const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  console.log("Webhook hit:", JSON.stringify(req.body, null, 2));

  const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (message) {
    const from = message.from;

    const reply = "Hello 👋 Thanks for messaging!";

    try {
      await fetch("https://graph.facebook.com/v18.0/959309777275020/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer EAALWwvfLWxcBRDS0sCCL2UhCUk0qlObpSbFktJLW3Iiih9Wg0MuE4l2CjrsfdwbvI7GnZBRoIVkkznHm2vTkvXC3VMLSwEt8O5ES3ZAJpZALOHb0G0KSxsEnwwu1oWx4ZA1fJZC3ZAZAfxBzArbHhhYzrtwhQpycojHrjfsqNutaUaxHKq7VnZABRDaGmD5V3xJZBFSeY0lE8qVrOruDCC2Tim81HRfvfVaEJfNUyTsHdc5HZAdyrhWIxVhlnjKTWTRFfBle7KAXRR6RN9zNuHvyW4IiVyegZDZD", // 👈 yaha daal
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

app.listen(10000, () => {
  console.log("Server running on port 10000");
});