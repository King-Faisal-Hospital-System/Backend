const generateInventoryReportTemplate = async (all_stocks) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalValue = all_stocks.reduce(
    (sum, stock) => sum + (stock.quantity || 0) * (stock.unit_price || 0),
    0
  );

  const totalQuantity = all_stocks.reduce(
    (sum, stock) => sum + (stock.quantity || 0),
    0
  );

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Inventory Report - King Faisal Hospital</title>
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
                border-bottom: 3px solid #2c5aa0;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .hospital-name {
                font-size: 28px;
                font-weight: bold;
                color: #2c5aa0;
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
                background-color: #f8f9fa;
                border-left: 4px solid #2c5aa0;
            }
            .report-title {
                font-size: 22px;
                font-weight: bold;
                color: #2c5aa0;
                margin: 0;
            }
            .report-info {
                text-align: right;
                font-size: 12px;
                color: #666;
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
                color: #2c5aa0;
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
                background-color: #2c5aa0;
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
                background-color: #f9f9f9; 
            }
            tr:hover {
                background-color: #f0f8ff;
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
            .page-break {
                page-break-before: always;
            }
        </style>
    </head>
    <body>
        <div class="letterhead">
            <h1 class="hospital-name">KING FAISAL HOSPITAL</h1>
            <p class="hospital-subtitle">Pharmacy & Inventory Management Department</p>
           <p class="hospital-subtitle">King faisal Hospital Rwanda | Tel: +250-XXX-XXX-XXX</p>

        </div>

        <div class="report-header">
            <div>
                <h2 class="report-title">COMPREHENSIVE INVENTORY REPORT</h2>
                <p style="margin: 5px 0; color: #666;">Stock Status & Valuation Summary</p>
            </div>
            <div class="report-info">
                <p><strong>Report Date:</strong> ${currentDate}</p>
                <p><strong>Generated:</strong> ${currentTime}</p>
                <p><strong>Report ID:</strong> INV-${Date.now()
                  .toString()
                  .slice(-6)}</p>
            </div>
        </div>

        <div class="summary-section">
            <div class="summary-card">
                <div class="summary-value">${all_stocks.length}</div>
                <div class="summary-label">Total Items</div>
            </div>
            <div class="summary-card">
                <div class="summary-value">${totalQuantity.toLocaleString()}</div>
                <div class="summary-label">Total Quantity</div>
            </div>
            <div class="summary-card">
  <div class="summary-value">
    RWF $${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
  </div>
  <div class="summary-label">Total Value</div>
</div>

        </div>

        <table>
            <thead>
                <tr>
                    <th style="width: 5%;">#</th>
                    <th style="width: 25%;">Product Name</th>
                    <th style="width: 12%;">Category</th>
                    <th style="width: 12%;">Form</th>
                    <th style="width: 10%;">Batch No.</th>
                     <th style="width: 10%;">Expiry Date</th>
                    <th style="width: 8%;">Qty</th>
                    <th style="width: 10%;">Unit Price</th>
                    <th style="width: 12%;">Total Value</th>
                    <th style="width: 6%;">Status</th>
                </tr>
            </thead>
            <tbody>
                ${all_stocks
                  .map((stock, index) => {
                    const isExpired =
                      stock.expiry_date &&
                      new Date(stock.expiry_date) < new Date();
                    const isLowStock = (stock.quantity || 0) < 10;
                    return `
                    <tr>
                        <td class="center">${index + 1}</td>
                        <td><strong>${stock.product_name || "N/A"}</strong></td>
                        <td class="center">${stock.category || "-"}</td>
                        <td class="center">${stock.form || "-"}</td>
                        <td class="center">${stock.batch_number || "-"}</td>
                       <td class="center">
  ${
    stock.expiry_date
      ? new Date(stock.expiry_date)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .replace(",", "/")
      : "-"
  }
</td>

                        <td class="center" style="color: ${
                          isLowStock ? "#dc3545" : "#333"
                        }">${(stock.quantity || 0).toLocaleString()}</td>
                        <td class="currency">$${(stock.unit_price || 0).toFixed(
                          2
                        )}</td>
                        <td class="currency"><strong>$${(
                          (stock.quantity || 0) * (stock.unit_price || 0)
                        ).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}</strong></td>
                        <td class="center">
                          <span style="color: ${
                            isExpired
                              ? "#dc3545"
                              : isLowStock
                              ? "#ffc107"
                              : "#28a745"
                          };">
                            ${
                              isExpired
                                ? "⚠️ EXPIRED"
                                : isLowStock
                                ? "⚠️ LOW"
                                : "✓ OK"
                            }
                          </span>
                        </td>
                    </tr>
                  `;
                  })
                  .join("")}
            </tbody>
        </table>

        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-line">
                    Prepared By<br>
                    <strong>Chief of Finance</strong>
                </div>
            </div>
            
        </div>

        <div class="footer">
            <p><strong>CONFIDENTIAL DOCUMENT</strong> - This report contains sensitive inventory information and should be handled according to hospital data protection policies.</p>
            <p>Generated automatically by KFH Inventory Management System | Report Version 2.1 | Page 1 of 1</p>
        </div>
    </body>
    </html>
  `;

  return html;
};

export default generateInventoryReportTemplate;
