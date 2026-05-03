import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";

async function startServer() {
  try {
    const app = express();
    const PORT = 3000;

    app.use(express.json());

    app.get("/api/health", (req, res) => {
      res.json({ status: "ok" });
    });

    app.post("/api/send-confirmation-email", async (req, res) => {
      const { email, name, packageTitle, travelers, totalAmount, date } = req.body;

      try {
        const host = process.env.SMTP_HOST;
        const port = process.env.SMTP_PORT;
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;

        if (!host || !port || !user || !pass) {
          console.warn("SMTP credentials missing");
          return res.status(200).json({ success: true, message: "SMTP not configured" });
        }

        const transporter = nodemailer.createTransport({
          host,
          port: parseInt(port),
          secure: parseInt(port) === 465,
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

        res.status(200).json({ success: true });
      } catch (error) {
        console.error("Email send error:", error);
        res.status(500).json({ error: "Failed to send email" });
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
    });
  } catch (err) {
    console.error("Startup error:", err);
  }
}

startServer();
