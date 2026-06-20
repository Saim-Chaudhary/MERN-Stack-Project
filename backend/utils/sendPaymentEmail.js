const resend = require('../config/resend');

const sendPaymentSuccessEmail = async ({ toEmail, customerName, packageTitle, amount, paymentType, bookingId }) => {
    try {
        await resend.emails.send({
            from: `Karwan-e-Arzoo Travel <${process.env.EMAIL_FROM}>`,
            to: toEmail,
            subject: 'Payment Received Successfully',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #16213e; padding: 24px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 22px;">Karwan-e-Arzoo-e-Tayba</h1>
                    <p style="color: #cce0e3; margin: 4px 0 0 0; font-size: 13px;">INTERNATIONAL TRAVELS & TOURS</p>
                </div>
                <div style="padding: 32px 24px;">
                    <h2 style="color: #16213e;">Assalam o Alaikum, ${customerName}!</h2>
                    <p style="color: #555; line-height: 1.6;">We have successfully received your payment. Thank you!</p>
                    
                    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h3 style="margin: 0 0 12px 0; color: #16213e;">Payment Details</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 6px 0; color: #888; font-size: 14px;">Package</td>
                                <td style="padding: 6px 0; font-weight: bold; color: #16213e; font-size: 14px;">${packageTitle}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #888; font-size: 14px;">Amount Paid</td>
                                <td style="padding: 6px 0; font-weight: bold; color: #1e8449; font-size: 14px;">$${Number(amount).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #888; font-size: 14px;">Payment Type</td>
                                <td style="padding: 6px 0; font-weight: bold; color: #16213e; font-size: 14px;">${paymentType}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #888; font-size: 14px;">Booking ID</td>
                                <td style="padding: 6px 0; font-size: 13px; color: #555;">${bookingId}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="text-align: center; margin: 28px 0;">
                        <a href="${process.env.FRONTEND_URL}/customer/bookings/${bookingId}" 
                           style="background-color: #16213e; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
                            View My Booking
                        </a>
                    </div>

                    <p style="color: #555;">Jazak Allah Khair,<br><strong>Karwan-e-Arzoo-e-Tayba Team</strong></p>
                </div>
                <div style="background: #f0f4f8; padding: 16px; text-align: center;">
                    <p style="color: #aaa; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Karwan-e-Arzoo-e-Tayba. All rights reserved.</p>
                </div>
            </div>
            `
        });
    } catch (err) {
        console.error('Resend email error:', err.message);
        // do not throw — email failure should not break payment flow
    }
};

module.exports = { sendPaymentSuccessEmail };