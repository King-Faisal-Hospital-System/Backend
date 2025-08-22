import PurchaseOrderEmailTemplate from "../templates/purchaseOrderEmail.template.js";

export const sendEmail = async (email, data) => {
    try {
        // email sending line
    } catch (error) {
        throw new Error(error)
    }
}

export const sendPurchaseOrderEmail = async (recipientEmail, orderData) => {
    try {
        const order_email = new PurchaseOrderEmailTemplate(orderData);
        await sendEmail(recipientEmail, order_email);
    } catch (error) {
        throw new Error(error)
    }
};