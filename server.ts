import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes FIRST
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/send-confirmation-email", async (req, res) => {
    const { email, name, packageTitle, travelers, totalAmount, date } = req.body;

    try {
      const nodemailer = await import("nodemailer");
      
      // Check for required env vars
      const host = process.env.SMTP_HOST;
      const port = process.env.SMTP_PORT;
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;

      if (!host || !port || !user || !pass) {
        console.warn("SMTP configuration is missing:", {
          host: !!host,
          port: !!port,
          user: !!user,
          pass: !!pass
        });
        return res.status(200).json({ success: true, message: "SMTP not configured, email skipped." });
      }

      console.log(`Attempting to send email to ${email} via ${host}:${port}`);

      const transporter = nodemailer.default.createTransport({
        host,
        port: parseInt(port),
        secure: parseInt(port) === 465,
        auth: {
          user,
          pass,
        },
        // For Gmail on 587, these settings help
        tls: {
          ciphers: 'SSLv3',
          rejectUnauthorized: false
        }
      });

      const mailOptions = {
        from: `"TripOnBudget" <${user}>`,
        to: email,
        subject: `Booking Confirmed: ${packageTitle}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #2563eb;">Booking Confirmed!</h2>
            <p>Hi <strong>${name}</strong>,</p>
            <p>Your booking for <strong>${packageTitle}</strong> has been confirmed successfully.</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Booking Details:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Package:</strong> ${packageTitle}</li>
                <li><strong>Date:</strong> ${date}</li>
                <li><strong>Travelers:</strong> ${travelers}</li>
                <li><strong>Total Amount:</strong> ₹${totalAmount.toLocaleString('en-IN')}</li>
              </ul>
            </div>

            <p style="background-color: #fff7ed; padding: 15px; border-radius: 8px; border: 1px solid #fed7aa; color: #9a3412;">
              <strong>Note:</strong> Your payment is currently <strong>Pending</strong>. Our team will contact you soon for the next steps.
            </p>

            <p>Thank you for choosing TripOnBudget!</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #666;">
              Ballabgarh, Faridabad, Haryana | +91 78279 16794 | padatvivek2@gmail.com
            </p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Email configuration check:', {
      host: process.env.SMTP_HOST || 'not set',
      port: process.env.SMTP_PORT || 'not set',
      user: process.env.SMTP_USER ? 'set' : 'not set',
      pass: process.env.SMTP_PASS ? 'set' : 'not set'
    });
  });
}

startServer();
