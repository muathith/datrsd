import type { Express } from "express";
import { type Server } from "http";
import { sendConfirmationEmail } from "./email";

function setEmailCorsHeaders(res: any) {
  // Allow calling this endpoint from a different origin (dev scenarios).
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS,GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // CORS preflight support (avoids 404 on OPTIONS in cross-origin dev setups)
  app.options("/api/send-confirmation-email", (_req, res) => {
    setEmailCorsHeaders(res);
    return res.status(204).end();
  });

  // Helpful for manual browser checks (GET would otherwise be 404)
  app.get("/api/send-confirmation-email", (_req, res) => {
    setEmailCorsHeaders(res);
    return res.status(200).json({ ok: true, method: "POST" });
  });

  // Send confirmation email endpoint
  app.post("/api/send-confirmation-email", async (req, res) => {
    try {
      setEmailCorsHeaders(res);
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
