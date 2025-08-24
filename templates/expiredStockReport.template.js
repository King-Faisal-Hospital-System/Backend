const generateExpiredStockReportTemplate = async (expiredItems) => {
    const data = {
        companyName: "King Faisal Hospital",
        reportDate: new Date()
    }

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Expired Stocks Report</title>
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
                <h1>${data.companyName}</h1>
                <h2>Expired Stock Report</h2>
            </div>
            
            <div class="report-date">
                Report Generated: ${data.reportDate}
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Expiry Date</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total Value</th>
                    </tr>
                </thead>
                <tbody>
                    ${expiredItems.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.expiry_date}</td>
                            <td>${item.quantity}</td>
                            <td>$${item.unit_price.toFixed(2)}</td>
                            <td>$${(item.quantity * item.unit_price).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                    <tr class="total-row">
                        <td colspan="5">Total Expired Stock Value</td>
                        <td>$${expiredItems.reduce((total, item) =>
        total + (item.quantity * item.unit_price), 0).toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </body>
        </html>
    `;
};

export default generateExpiredStockReportTemplate