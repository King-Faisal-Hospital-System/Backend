const generateSupplierReportTemplate = async (supplier, supplierStocks) => {
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Supplier Report - ${supplier.company_name}</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .supplier-info { margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Supplier Report</h1>
                    <h2>${supplier.company_name}</h2>
                </div>
                
                <div class="supplier-info">
                    <p><strong>Supplier ID:</strong> ${supplier._id}</p>
                    <p><strong>Contact:</strong> ${supplier.contact || 'N/A'}</p>
                    <p><strong>Address:</strong> ${supplier.address || 'N/A'}</p>
                </div>

                <h3>Stock Items</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${supplierStocks.map(stock => `
                            <tr>
                                <td>${stock.name}</td>
                                <td>${stock.quantity}</td>
                                <td>$${stock.unit_price?.toFixed(2) || '0.00'}</td>
                                <td>$${(stock.quantity * (stock.unit_price || 0)).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div style="margin-top: 20px; text-align: right;">
                    <p><strong>Total Items:</strong> ${supplierStocks.length}</p>
                    <p><strong>Total Value:</strong> $${supplierStocks.reduce((total, stock) => 
                        total + (stock.quantity * (stock.unit_price || 0)), 0).toFixed(2)}</p>
                </div>

                <footer style="margin-top: 50px; text-align: center;">
                    <p>Generated on: ${new Date().toLocaleDateString()}</p>
                </footer>
            </body>
        </html>
    `;
};

export default generateSupplierReportTemplate