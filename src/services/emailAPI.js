// Node.js Express API for sending ticket emails
import { Router } from 'express';
import { createTransport } from 'nodemailer';
import { generateTicketEmailHtml, generateTicketEmailText } from '../templates/ticketEmailTemplate';
import { json } from 'body-parser';

const router = Router();
router.use(json());

// Email configuration
const EMAIL_CONFIG = {
  HOST: process.env.EMAIL_HOST || 'smtp.example.com',
  PORT: process.env.EMAIL_PORT || 587,
  USER: process.env.EMAIL_USER || 'noreply@yourdomain.com',
  PASSWORD: process.env.EMAIL_PASSWORD,
  FROM: process.env.EMAIL_FROM || 'Event System <noreply@yourdomain.com>'
};

/**
 * Configure email transporter
 */
const transporter = createTransport({
  host: EMAIL_CONFIG.HOST,
  port: EMAIL_CONFIG.PORT,
  secure: EMAIL_CONFIG.PORT === 465,
  auth: {
    user: EMAIL_CONFIG.USER,
    pass: EMAIL_CONFIG.PASSWORD
  }
});

/**
 * Send ticket confirmation email
 */
router.post('/send-ticket', async (req, res) => {
  try {
    const { ticket, event, user } = req.body;

    if (!ticket || !event || !user) {
      return res.status(400).json({
        success: false,
        message: 'Missing required ticket information'
      });
    }

    if (!user.email) {
      return res.status(400).json({
        success: false,
        message: 'User email is required'
      });
    }

    // Generate email content
    const htmlContent = generateTicketEmailHtml({ ticket, event, user });
    const textContent = generateTicketEmailText({ ticket, event, user });

    // Send email
    const mailOptions = {
      from: EMAIL_CONFIG.FROM,
      to: user.email,
      subject: `Your Ticket for ${event.title}`,
      text: textContent,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Ticket email sent successfully'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send ticket email'
    });
  }
});

export default router;
