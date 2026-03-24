app.post("/webhook", async (req, res) => {
  console.log("Webhook hit:", JSON.stringify(req.body, null, 2));

  try {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message) {
      const from = message.from;
      const text = message.text?.body;

      console.log("From:", from);
      console.log("Text:", text);

      const reply = "Hello 👋 Thanks for messaging!";

      const response = await fetch(
        "https://graph.facebook.com/v18.0/959309777275020/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer EAALWwvfLWxcBRJC5ODPcmTmHin1MWrSSe4ekZAwwoHiOJlutb0l49VZCfFeVObEiXpZArCZCBvZA2qCmFEsOVUfQG07J9pvOc2UR1jm8YlV47vNSsOCoji6CjazxMDTMf8c6cc1fqFR4Wve6cTUs1KQlmWnbDcp9XX2P8WSLBOIGKxppG6lXQOTw8txPIag0ZCDfptOMFjZCLJcVLncSIFNqy2KCpJGGbhHKWiLpCOkgTWjOdHcrEyixmZBPuuiWyoWgYgKYmOM8LjTmfwhvvLrQuWAY"
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: from,
            text: { body: reply }
          })
        }
      );

      const data = await response.json();
      console.log("Meta Response:", data);
    }

    res.sendStatus(200);
  } catch (err) {
    console.log("ERROR:", err);
    res.sendStatus(500);
  }
});