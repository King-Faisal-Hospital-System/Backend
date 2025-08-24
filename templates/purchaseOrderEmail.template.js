const companyDetails = {
    name : "King Faisal Hospital Rwanda",
    address : "Kigali, Rwanda",
    email : "info@kfh.com"
}
const generatePurchaseOrderEmail = async ({
  purchase_order,
  stock,
  supplier
}) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Purchase Order Request</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="text-align: right; margin-bottom: 20px;">
          <h2 style="color: #2c3e50;">PURCHASE ORDER REQUEST</h2>
          <p>Status: ${purchase_order.status}</p>
          <p>Date: ${purchase_order.order_date}</p>
        </div>

        <div style="margin-bottom: 30px;">
          <div style="float: left;">
            <h3>From:</h3>
            <p>${companyDetails.name}<br>
            ${companyDetails.address}<br>
            ${companyDetails.phone}<br>
            ${companyDetails.email}</p>
          </div>
          <div style="float: right;">
            <h3>To:</h3>
            <p>${supplier.name}<br>
            ${supplier.address}</p>
          </div>
          <div style="clear: both;"></div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 12px 8px; border: 1px solid #ddd;">Item</th>
              <th style="padding: 12px 8px; border: 1px solid #ddd;">Quantity</th>
              <th style="padding: 12px 8px; border: 1px solid #ddd;">Unit Price</th>
              <th style="padding: 12px 8px; border: 1px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">${stock.name}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${purchase_order.quantity}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">$${stock.unit_price.toFixed(2)}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">$${purchase_order.total_value.toFixed(2)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="text-align: right; padding: 8px; border: 1px solid #ddd;"><strong>Total Amount:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>$${purchase_order.total_value.toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>

        <div style="margin-bottom: 20px;">
          <h3>Additional Notes:</h3>
          <p>${purchase_order.notes || 'No additional notes'}</p>
        </div>

        <div style="margin-top: 30px;">
          <p>If you have any questions about this purchase order request, please contact us at ${companyDetails.email}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export default generatePurchaseOrderEmail;
