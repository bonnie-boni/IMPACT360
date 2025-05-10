// Email template for event ticket confirmation

/**
 * Generate HTML email template for ticket confirmation
 * @param {Object} data - Ticket and event information
 * @returns {string} - HTML email content
 */
export const generateTicketEmailHtml = (data) => {
  const {
    ticket,
    event,
    user
  } = data;

  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const eventDate = formatDate(event.date);
  const purchaseDate = formatDate(ticket.purchase_date);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Event Ticket</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
        }
        .email-header {
          background-color: #3498db;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .email-body {
          padding: 20px;
        }
        .ticket {
          border: 2px dashed #ddd;
          border-radius: 8px;
          margin: 20px 0;
          position: relative;
          overflow: hidden;
        }
        .ticket:before {
          content: '';
          position: absolute;
          top: 0;
          right: 120px;
          width: 2px;
          height: 100%;
          background-image: linear-gradient(to bottom, #ddd 0%, #ddd 50%, transparent 50%);
          background-size: 2px 16px;
        }
        .ticket-inner {
          display: flex;
        }
        .ticket-left {
          flex: 1;
          padding: 20px;
        }
        .ticket-right {
          width: 120px;
          padding: 20px 0;
          background-color: #f8f9fa;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .ticket-code {
          font-weight: bold;
          font-size: 18px;
          letter-spacing: 2px;
          margin-top: 10px;
        }
        .event-title {
          font-size: 22px;
          font-weight: bold;
          color: #2c3e50;
          margin-top: 0;
        }
        .event-details {
          margin: 15px 0;
        }
        .detail-row {
          display: flex;
          margin-bottom: 8px;
        }
        .detail-label {
          width: 100px;
          color: #7f8c8d;
          font-weight: 500;
        }
        .detail-value {
          flex: 1;
          font-weight: 500;
        }
        .qr-code {
          width: 80px;
          height: 80px;
          background-color: #ddd;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #777;
        }
        .info-section {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        .info-title {
          font-size: 18px;
          font-weight: bold;
          color: #2c3e50;
          margin-top: 0;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #7f8c8d;
        }
        .important {
          color: #e74c3c;
          font-weight: bold;
        }
        .cta-button {
          display: inline-block;
          background-color: #2ecc71;
          color: white;
          text-decoration: none;
          padding: 12px 25px;
          border-radius: 4px;
          margin-top: 15px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>Your Ticket Confirmation</h1>
        </div>

        <div class="email-body">
          <p>Hello ${user.full_name || 'there'},</p>

          <p>Thank you for your purchase! Here's your ticket to <strong>${event.title}</strong>.</p>

          <div class="ticket">
            <div class="ticket-inner">
              <div class="ticket-left">
                <h2 class="event-title">${event.title}</h2>

                <div class="event-details">
                  <div class="detail-row">
                    <div class="detail-label">Date:</div>
                    <div class="detail-value">${eventDate}</div>
                  </div>
                  <div class="detail-row">
                    <div class="detail-label">Location:</div>
                    <div class="detail-value">${event.location}</div>
                  </div>
                  <div class="detail-row">
                    <div class="detail-label">Ticket:</div>
                    <div class="detail-value">${ticket.price_paid ? 'KSH ' + ticket.price_paid.toLocaleString('en-US') : 'Standard Entry'}</div>
                  </div>
                  <div class="detail-row">
                    <div class="detail-label">Purchased:</div>
                    <div class="detail-value">${purchaseDate}</div>
                  </div>
                </div>
              </div>

              <div class="ticket-right">
                <div class="qr-code">QR Code</div>
                <div class="ticket-code">${ticket.ticket_code}</div>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3 class="info-title">Important Information</h3>
            <ul>
              <li>Please arrive 30 minutes before the event starts.</li>
              <li>Have your ticket ready for scanning at the entrance.</li>
              <li>This ticket is unique to you and should not be shared.</li>
              <li class="important">No refunds or exchanges.</li>
            </ul>

            <p>Need more information about the event? Visit our website or contact our support team.</p>

            <a href="#" class="cta-button">View Event Details</a>
          </div>
        </div>

        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          <p>If you did not purchase this ticket, please contact support immediately.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate plaintext email template for ticket confirmation
 * @param {Object} data - Ticket and event information
 * @returns {string} - Text email content
 */
export const generateTicketEmailText = (data) => {
  const {
    ticket,
    event,
    user
  } = data;

  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const eventDate = formatDate(event.date);
  const purchaseDate = formatDate(ticket.purchase_date);

  return `
YOUR TICKET CONFIRMATION

Hello ${user.full_name || 'there'},

Thank you for your purchase! Here's your ticket to ${event.title}.

EVENT DETAILS:
- Event: ${event.title}
- Date: ${eventDate}
- Location: ${event.location}
- Ticket: KSH ${ticket.price_paid ? ticket.price_paid.toLocaleString('en-US') : 'Standard Entry'}
- Purchased: ${purchaseDate}

YOUR TICKET CODE: ${ticket.ticket_code}

IMPORTANT INFORMATION:
- Please arrive 30 minutes before the event starts.
- Have your ticket ready for scanning at the entrance.
- This ticket is unique to you and should not be shared.
- No refunds or exchanges.

Need more information about the event? Visit our website or contact our support team.

© ${new Date().getFullYear()} Your Company Name. All rights reserved.
If you did not purchase this ticket, please contact support immediately.
  `;
};
