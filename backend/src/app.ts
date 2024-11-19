import express from "express";
import cors from "cors";
import webPush from "web-push";

const app = express();

app.use(express.json());
app.use(cors());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

const vapidKeys = webPush.generateVAPIDKeys();
console.log("🚀 ~ vapidKeys:", vapidKeys)

webPush.setVapidDetails("mailto:kedarvyas@gmail.com", vapidKeys.publicKey, vapidKeys.privateKey);

let subscriptions: Record<
  string,
  {
    endpoint: string;
    expirationTime?: null | number;
    keys: {
      p256dh: string;
      auth: string;
    };
  }
> = {};

// Endpoint to save subscriptions
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  console.log("🚀 ~ app.post ~ subscription:", subscription);
  const userId = subscription.user_id || "default-user";
  subscriptions[userId] = subscription;
  console.log("Subscription saved for user:", userId);
  res.status(201).json({ message: "Subscription saved successfully." });
});

// Endpoint to send a notification to a specific user
app.post("/send-notification", (req, res) => {
  const { userId, title, body } = req.body;
  console.log("🚀 ~ app.post ~ subscriptions:", subscriptions);
  const subscription = subscriptions[userId];
  if (!subscription) {
    return res.status(404).json({ error: "User not subscribed." });
  }

  const payload = JSON.stringify({ title, body });

  webPush
    .sendNotification(subscription, payload)
    .then(() => res.status(200).json({ message: "Notification sent successfully." }))
    .catch((error) => {
      console.error("Error sending notification:", error);
      res.status(500).json({ error: "Failed to send notification." });
    });
});

export default app;
