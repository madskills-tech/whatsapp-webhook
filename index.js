app.post("/webhook", async (req, res) => {
  try {
    const message =
      req.body.entry[0].changes[0].value.messages[0];

    const from = message.from;
    const text = message.text.body;

    console.log("Message from:", from);
    console.log("Text:", text);

    // AUTO REPLY TEXT
    const reply = "Hello 👋 Thanks for messaging!";

    // SEND MESSAGE API
    await fetch(
      `https://graph.facebook.com/v18.0/959309777275020/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer EAALWwvfLWxcBRN61su0FUA6SpDkQanarP8Tv7HDhsff8ZAkfpU8ypdfDwT8qZAIIUjcp1wtzT0LCyFr5BYONZBSizpkyaEIsixsXYYSIrVjM3C69HpmXidYQJKUdSiPkIyeCqCYfBXi7WMQJ12LQWEifDxyNLZCG3cNPyoGxLIGyiqGBbFoI4tGtTHC3iaKlwahBF8AGixo4adnHPU2zIJquAoHaI2g2Wqu5iNsUJ7XjQWHyA3JZB5ZCTtw1SO4wnD9CLa3zRABkTnoXvfyaGOVSljmwZDZD",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          text: { body: reply },
        }),
      }
    );

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});