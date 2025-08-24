const generateInventoryReportTemplate = async (all_stocks) => {
  const currentDate = new Date().toLocaleDateString();
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Inventory Report</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f4f4f4; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .footer { margin-top: 30px; text-align: center; font-size: 0.9em; color: #666; }
            .summary { margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Inventory Stock Report</h1>
            <p>Generated on: ${currentDate}</p>
        </div>

        <div class="summary">
            <h3>Inventory Summary</h3>
            <p>Total Items: ${all_stocks.length}</p>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total Value</th>
                    <th>Form</th>
                    <th>Category</th>
                </tr>
            </thead>
            <tbody>
                ${all_stocks.map(stock => `
                    <tr>
                        <td>${stock.product_name || '-'}</td>
                        <td>${stock.quantity || 0}</td>
                        <td>$${stock.unit_price?.toFixed(2) || '0.00'}</td>
                        <td>$${((stock.quantity || 0) * (stock.unit_price || 0)).toFixed(2)}</td>
                        <td>${stock.form || '-'}</td>
                        <td>${stock.category || '-'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="footer">
            <p>This is an automatically generated report. Please contact the inventory manager for any queries.</p>
        </div>
    </body>
    </html>
  `;

  return html;
};

export default generateInventoryReportTemplate