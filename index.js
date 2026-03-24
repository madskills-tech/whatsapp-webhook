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
          Authorization: "Bearer EAALWwvfLWxcBRPEDSHNqhCJvd5DdLLWGFZCpuk81XG7dVrZBdY1sCKdOapXfC5Lfo8KDXpBy8nQ44fmJT4Oo31WEbJWqBz3UG2CyNwt4yadDWue9V7pjlBfoBhT7XSs0nVWQ8Ws3anSfaksugUiPayyIYw8As5GFkx9rmG3aLEX11YxOQNbwVVCoEGTZBBtrHad6QUQVZC0Ley3d57eV1zu1n7bCuKJDPlbvqzgvCqTKDnTZCuT2E72h7ZCkRhZBKXMz9M9Hm8RR4rUHAMbC1Axl7sL",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: from,   // ✅ YE IMPORTANT HAI
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