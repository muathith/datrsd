import type { Express } from "express";
import { type Server } from "http";
import { sendConfirmationEmail } from "./email";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Send confirmation email endpoint
  app.post("/api/send-confirmation-email", async (req, res) => {
    try {
      const { email, name } = req.body;
      
      if (!email || !name) {
        return res.status(400).json({ success: false, error: "Email and name are required" });
      }

      const result = await sendConfirmationEmail(email, name);

      if (!result.success) {
        return res.status(500).json({ success: false, error: "Failed to send email" });
      }

      res.json({ success: true, message: "Email sent successfully" });
    } catch (error) {
      console.error("Email send error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  return httpServer;
}
