// Node.js Express API for handling M-Pesa STK Push
import { Router } from 'express';
import { get, post } from 'axios';
import { json } from 'body-parser';

const router = Router();
router.use(json());

// M-Pesa API configuration
const MPESA_CONFIG = {
  CONSUMER_KEY: process.env.MPESA_CONSUMER_KEY,
  CONSUMER_SECRET: process.env.MPESA_CONSUMER_SECRET,
  PASSKEY: process.env.MPESA_PASSKEY,
  SHORT_CODE: process.env.MPESA_SHORT_CODE,
  CALLBACK_URL: process.env.MPESA_CALLBACK_URL || 'https://yourdomain.com/api/payments/stk-callback',
  AUTH_URL: 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
  STK_URL: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
};

/**
 * Get OAuth token from M-Pesa
 * @returns {Promise<string>} - Access token
 */
const getOAuthToken = async () => {
  try {
    const auth = Buffer.from(`${MPESA_CONFIG.CONSUMER_KEY}:${MPESA_CONFIG.CONSUMER_SECRET}`).toString('base64');

    const response = await get(MPESA_CONFIG.AUTH_URL, {
      headers: {
        "Authorization": `Basic ${auth}`
      }
    });

    return response.data.access_token;
  } catch (error) {
    console.error('M-Pesa OAuth error:', error);
    throw new Error('Failed to get M-Pesa access token');
  }
};

/**
 * Generate password for STK Push
 * @returns {string} - The generated password
 */
const generatePassword = () => {
  const timestamp = getTimestamp();
  const shortcode = MPESA_CONFIG.SHORT_CODE;
  const passkey = MPESA_CONFIG.PASSKEY;

  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
};

/**
 * Get current timestamp in format YYYYMMDDHHmmss
 * @returns {string} - Formatted timestamp
 */
const getTimestamp = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hour}${minute}${second}`;
};

/**
 * Initiate STK Push request
 */
router.post('/stk-push', async (req, res) => {
  try {
    const { phoneNumber, amount, reference } = req.body;

    // Validate input
    if (!phoneNumber || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and amount are required'
      });
    }

    // Get access token
    const accessToken = await getOAuthToken();

    // Prepare STK Push request
    const timestamp = getTimestamp();
    const password = generatePassword();
    const shortCode = MPESA_CONFIG.SHORT_CODE;

    const requestBody = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.ceil(amount),
      PartyA: phoneNumber,
      PartyB: shortCode,
      PhoneNumber: phoneNumber,
      CallBackURL: MPESA_CONFIG.CALLBACK_URL,
      AccountReference: reference || "Event Ticket",
      TransactionDesc: "Event Ticket Purchase"
    };

    // Send STK Push request
    const response = await post(MPESA_CONFIG.STK_URL, requestBody, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });

    // Store request details in database for later verification
    // This would be implemented based on your database structure

    return res.status(200).json({
      success: true,
      message: 'STK Push sent successfully',
      checkoutRequestId: response.data.CheckoutRequestID
    });

  } catch (error) {
    console.error('STK Push error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.errorMessage || 'Failed to process payment request'
    });
  }
});

/**
 * Callback URL for M-Pesa STK Push responses
 */
router.post('/stk-callback', async (req, res) => {
  try {
    const { Body } = req.body;

    // Acknowledge receipt of callback
    res.status(200).json({ success: true });

    // Process callback data
    if (Body.stkCallback.ResultCode === 0) {
      // Payment successful
      const checkoutRequestId = Body.stkCallback.CheckoutRequestID;
      const mpesaReceiptNumber = Body.stkCallback.CallbackMetadata.Item.find(
        item => item.Name === 'MpesaReceiptNumber'
      ).Value;
      const amount = Body.stkCallback.CallbackMetadata.Item.find(
        item => item.Name === 'Amount'
      ).Value;
      const phoneNumber = Body.stkCallback.CallbackMetadata.Item.find(
        item => item.Name === 'PhoneNumber'
      ).Value;

      // Update transaction status in your database
      // This would be implemented based on your database structure

      // Optionally trigger email notification here

    } else {
      // Payment failed
      console.error('M-Pesa payment failed:', Body.stkCallback.ResultDesc);

      // Update transaction status in your database
      // This would be implemented based on your database structure
    }

  } catch (error) {
    console.error('STK Callback error:', error);
    // Log error but still return 200 to M-Pesa
    res.status(200).json({ success: true });
  }
});

/**
 * API endpoint to query payment status
 */
router.get('/check-payment/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;

    // Query your database for payment status
    // This would be implemented based on your database structure

    // For demonstration, simulating a response
    const randomSuccess = Math.random() > 0.3;

    if (randomSuccess) {
      return res.status(200).json({
        success: true,
        paid: true,
        mpesaReceiptNumber: 'PDQ' + Math.floor(Math.random() * 10000000)
      });
    } else {
      return res.status(200).json({
        success: true,
        paid: false,
        message: 'Payment pending or failed'
      });
    }

  } catch (error) {
    console.error('Check payment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check payment status'
    });
  }
});

export default router;
