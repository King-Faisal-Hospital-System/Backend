import transporter from "../config/email.config.js";
import generatePurchaseOrderEmail from "../templates/purchaseOrderEmail.template.js";


export const sendMessageEmail = async (to, subject, message) => {
    try {
        const email = await transporter.sendMail({
            from: `"Polo @KFH <nelsonprox92@gmail.com>`,
            to: to,
            subject: subject,
            text: message
        });
        return email.messageId
    } catch (error) {
        throw new Error(error)
    }
};

export const sendEmail = async (to, html, subject) => {
    try {
        await transporter.sendMail({
            from: `Stock Manager <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html
        });
    } catch (error) {
        throw new Error(error)
    }
}

export const sendPurchaseOrderEmail = async (recipientEmail, orderData) => {
    try {
        const order_email = await generatePurchaseOrderEmail(orderData);
        await sendEmail(recipientEmail, order_email, "Purchase Order Request");
    } catch (error) {
        throw new Error(error)
    }
};