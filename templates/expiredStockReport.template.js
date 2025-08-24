const expiredStockReportTemplate = async (data) => {
    const { companyName, reportDate, expiredItems } = data;
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Expired Stock Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .header { text-align: center; margin-bottom: 30px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background-color: #f2f2f2; }
                .total-row { font-weight: bold; background-color: #f9f9f9; }
                .report-date { text-align: right; margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>${companyName}</h1>
                <h2>Expired Stock Report</h2>
            </div>
            
            <div class="report-date">
                Report Generated: ${reportDate}
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>SKU</th>
                        <th>Expiry Date</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total Value</th>
                    </tr>
                </thead>
                <tbody>
                    ${expiredItems.map(item => `
                        <tr>
                            <td>${item.productName}</td>
                            <td>${item.sku}</td>
                            <td>${item.expiryDate}</td>
                            <td>${item.quantity}</td>
                            <td>$${item.unitPrice.toFixed(2)}</td>
                            <td>$${(item.quantity * item.unitPrice).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                    <tr class="total-row">
                        <td colspan="5">Total Loss Value</td>
                        <td>$${expiredItems.reduce((total, item) => 
                            total + (item.quantity * item.unitPrice), 0).toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </body>
        </html>
    `;
};

const ExpiredStockReportTemplate = expiredStockReportTemplate;
export default ExpiredStockReportTemplate;
