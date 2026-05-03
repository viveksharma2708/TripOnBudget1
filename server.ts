import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";

async function startServer() {
  try {
    const app = express();
    const PORT = 3000;

    app.use(express.json());

    // Health check
    app.get("/api/health", (req, res) => {
      res.json({ status: "ok" });
    });

    // Email Confirmation Endpoint
    app.post("/api/send-confirmation-email", async (req, res) => {
      const { email, name, packageTitle, travelers, totalAmount, date } = req.body;
      console.log(`[Email] Received request for ${email}, package: ${packageTitle}`);

      try {
        const host = process.env.SMTP_HOST;
        const port = process.env.SMTP_PORT;
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;

        if (!host || !port || !user || !pass) {
          console.warn("[Email] SMTP credentials missing in environment variables");
          return res.status(500).json({ 
            success: false, 
            error: "SMTP not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS env vars." 
          });
        }

        console.log(`[Email] Attempting to send using host: ${host}, port: ${port}, user: ${user}`);

        const transporter = nodemailer.createTransport({
          host,
          port: parseInt(port),
          secure: parseInt(port) === 465, // usually true for 465, false for 587
          auth: { user, pass },
          tls: { rejectUnauthorized: false }
        });

        await transporter.sendMail({
          from: `"TripOnBudget" <${user}>`,
          to: email,
          subject: `Booking Confirmed: ${packageTitle}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
              <div style="background: #2563eb; padding: 20px; text-align: center; color: white;">
                <h2>Booking Confirmed!</h2>
              </div>
              <div style="padding: 20px;">
                <p>Hi ${name},</p>
                <p>Your booking for <strong>${packageTitle}</strong> is confirmed. Details:</p>
                <ul>
                  <li><strong>Date:</strong> ${date}</li>
                  <li><strong>Travelers:</strong> ${travelers}</li>
                  <li><strong>Total:</strong> ₹${totalAmount.toLocaleString('en-IN')}</li>
                </ul>
                <p style="background: #fff7ed; padding: 10px; border-radius: 6px; color: #9a3412;">
                  <strong>Note:</strong> Payment is pending. We will contact you soon.
                </p>
              </div>
              <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                TripOnBudget | +91 78279 16794
              </div>
            </div>
          `,
        });

        console.log(`[Email] Success: Confirmation sent to ${email}`);
        res.status(200).json({ success: true });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("[Email] Error sending email:", error);
        
        if (errorMessage.includes('Application-specific password required')) {
          return res.status(500).json({ 
            error: "Authentication failed", 
            details: "Gmail requires an 'App Password'. Please generate one in your Google Security settings and update SMTP_PASS." 
          });
        }
        
        res.status(500).json({ error: "Failed to send email", details: errorMessage });
      }
    });

    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server started on port ${PORT}`);
      console.log('[Startup] SMTP Configuration Check:', {
        host: process.env.SMTP_HOST || 'MISSING',
        port: process.env.SMTP_PORT || 'MISSING',
        user: process.env.SMTP_USER ? 'SET' : 'MISSING',
        pass: process.env.SMTP_PASS ? 'SET' : 'MISSING'
      });
    });
  } catch (err) {
    console.error("Startup error:", err);
  }
}

startServer();
