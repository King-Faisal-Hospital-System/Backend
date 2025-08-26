const generateSupplierReportTemplate = async (supplier, supplierStocks) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const totalValue = supplierStocks.reduce((total, stock) => 
        total + ((stock.quantity || 0) * (stock.unit_price || 0)), 0
    );
    const totalQuantity = supplierStocks.reduce((total, stock) => total + (stock.quantity || 0), 0);

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Supplier Report - ${supplier.company_name}</title>
            <style>
                @page {
                    margin: 0.5in;
                    size: A4;
                }
                body { 
                    font-family: 'Times New Roman', serif; 
                    margin: 0; 
                    padding: 20px;
                    line-height: 1.4;
                    color: #333;
                }
                .letterhead {
                    text-align: center;
                    border-bottom: 3px solid #17a2b8;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .hospital-name {
                    font-size: 28px;
                    font-weight: bold;
                    color: #17a2b8;
                    margin: 0;
                }
                .hospital-subtitle {
                    font-size: 14px;
                    color: #666;
                    margin: 5px 0;
                }
                .report-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                    padding: 15px;
                    background-color: #f0f9ff;
                    border-left: 4px solid #17a2b8;
                }
                .report-title {
                    font-size: 22px;
                    font-weight: bold;
                    color: #17a2b8;
                    margin: 0;
                }
                .report-info {
                    text-align: right;
                    font-size: 12px;
                    color: #666;
                }
                .supplier-details {
                    background: #fff;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 30px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .supplier-name {
                    font-size: 20px;
                    font-weight: bold;
                    color: #17a2b8;
                    margin-bottom: 15px;
                    border-bottom: 2px solid #e9ecef;
                    padding-bottom: 10px;
                }
                .supplier-info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                }
                .info-item {
                    display: flex;
                    flex-direction: column;
                }
                .info-label {
                    font-size: 11px;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 3px;
                }
                .info-value {
                    font-size: 14px;
                    font-weight: 500;
                    color: #333;
                }
                .summary-section {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    margin-bottom: 30px;
                }
                .summary-card {
                    background: #fff;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 20px;
                    text-align: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .summary-value {
                    font-size: 24px;
                    font-weight: bold;
                    color: #17a2b8;
                    margin-bottom: 5px;
                }
                .summary-label {
                    font-size: 12px;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin: 20px 0;
                    font-size: 11px;
                }
                th {
                    background-color: #17a2b8;
                    color: white;
                    padding: 12px 8px;
                    text-align: left;
                    font-weight: bold;
                    text-transform: uppercase;
                    font-size: 10px;
                    letter-spacing: 0.5px;
                }
                td {
                    border-bottom: 1px solid #eee;
                    padding: 10px 8px;
                    vertical-align: top;
                }
                tr:nth-child(even) { 
                    background-color: #f8f9fa; 
                }
                tr:hover {
                    background-color: #e8f4f8;
                }
                .currency {
                    text-align: right;
                    font-family: 'Courier New', monospace;
                }
                .center {
                    text-align: center;
                }
                .footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    font-size: 10px;
                    color: #666;
                }
                .signature-section {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 50px;
                }
                .signature-box {
                    text-align: center;
                    width: 200px;
                }
                .signature-line {
                    border-top: 1px solid #333;
                    margin-top: 40px;
                    padding-top: 5px;
                    font-size: 11px;
                }
                .performance-metrics {
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="letterhead">
                <h1 class="hospital-name">KING FAISAL HOSPITAL</h1>
                <p class="hospital-subtitle">Pharmacy & Inventory Management Department</p>
                <p class="hospital-subtitle">P.O. Box 40047, Jeddah 21499, Saudi Arabia | Tel: +966-12-667-7777</p>
            </div>

            <div class="report-header">
                <div>
                    <h2 class="report-title">SUPPLIER PERFORMANCE REPORT</h2>
                    <p style="margin: 5px 0; color: #666;">Inventory & Financial Analysis</p>
                </div>
                <div class="report-info">
                    <p><strong>Report Date:</strong> ${currentDate}</p>
                    <p><strong>Generated:</strong> ${currentTime}</p>
                    <p><strong>Report ID:</strong> SUP-${Date.now().toString().slice(-6)}</p>
                </div>
            </div>

            <div class="supplier-details">
                <div class="supplier-name">${supplier.company_name || 'N/A'}</div>
                <div class="supplier-info-grid">
                    <div class="info-item">
                        <div class="info-label">Supplier ID</div>
                        <div class="info-value">${supplier._id || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Contact Person</div>
                        <div class="info-value">${supplier.contact_person || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Email Address</div>
                        <div class="info-value">${supplier.company_email || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Phone Number</div>
                        <div class="info-value">${supplier.company_phone || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Address</div>
                        <div class="info-value">${supplier.address || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Payment Terms</div>
                        <div class="info-value">${supplier.payment_terms ? supplier.payment_terms + ' days' : 'N/A'}</div>
                    </div>
                </div>
            </div>

            <div class="summary-section">
                <div class="summary-card">
                    <div class="summary-value">${supplierStocks.length}</div>
                    <div class="summary-label">Products Supplied</div>
                </div>
                <div class="summary-card">
                    <div class="summary-value">${totalQuantity.toLocaleString()}</div>
                    <div class="summary-label">Total Quantity</div>
                </div>
                <div class="summary-card">
                    <div class="summary-value">$${totalValue.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                    <div class="summary-label">Total Value</div>
                </div>
            </div>

            ${supplierStocks.length === 0 ? `
                <div style="text-align: center; padding: 40px; background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; color: #856404;">
                    <h3>📦 No Products Found</h3>
                    <p>This supplier currently has no products in inventory.</p>
                </div>
            ` : `
                <div class="performance-metrics">
                    <h3 style="color: #17a2b8; margin-top: 0;">Product Portfolio</h3>
                    <p>Detailed breakdown of all products supplied by ${supplier.company_name}</p>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 5%;">#</th>
                            <th style="width: 30%;">Product Name</th>
                            <th style="width: 12%;">Category</th>
                            <th style="width: 12%;">Form</th>
                            <th style="width: 10%;">Batch No.</th>
                            <th style="width: 8%;">Quantity</th>
                            <th style="width: 10%;">Unit Price</th>
                            <th style="width: 13%;">Total Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${supplierStocks.map((stock, index) => `
                            <tr>
                                <td class="center">${index + 1}</td>
                                <td><strong>${stock.product_name || stock.name || 'N/A'}</strong></td>
                                <td class="center">${stock.category || '-'}</td>
                                <td class="center">${stock.form || '-'}</td>
                                <td class="center">${stock.batch_number || '-'}</td>
                                <td class="center">${(stock.quantity || 0).toLocaleString()}</td>
                                <td class="currency">$${(stock.unit_price || 0).toFixed(2)}</td>
                                <td class="currency"><strong>$${((stock.quantity || 0) * (stock.unit_price || 0)).toLocaleString('en-US', {minimumFractionDigits: 2})}</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `}

            <div class="signature-section">
                <div class="signature-box">
                    <div class="signature-line">
                        Prepared By<br>
                        <strong>Inventory Manager</strong>
                    </div>
                </div>
                <div class="signature-box">
                    <div class="signature-line">
                        Reviewed By<br>
                        <strong>Procurement Officer</strong>
                    </div>
                </div>
                <div class="signature-box">
                    <div class="signature-line">
                        Approved By<br>
                        <strong>Supply Chain Director</strong>
                    </div>
                </div>
            </div>

            <div class="footer">
                <p><strong>CONFIDENTIAL DOCUMENT</strong> - This report contains sensitive supplier and inventory information.</p>
                <p>Generated automatically by KFH Inventory Management System | Report Version 2.1 | Page 1 of 1</p>
            </div>
        </body>
        </html>
    `;
};

export default generateSupplierReportTemplate