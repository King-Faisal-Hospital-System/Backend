const generateExpiredStockReportTemplate = async (expiredItems) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalExpiredValue = expiredItems.reduce(
    (total, item) => total + (item.quantity || 0) * (item.unit_price || 0),
    0
  );
  const totalExpiredQuantity = expiredItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Expired Stock Report - King Faisal Hospital</title>
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
                    border-bottom: 3px solid #dc3545;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .hospital-name {
                    font-size: 28px;
                    font-weight: bold;
                    color: #dc3545;
                    margin: 0;
                }
                .hospital-subtitle {
                    font-size: 14px;
                    color: #666;
                    margin: 5px 0;
                }
                .alert-banner {
                    background-color: #f8d7da;
                    border: 2px solid #dc3545;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 25px;
                    text-align: center;
                }
                .alert-title {
                    color: #721c24;
                    font-size: 18px;
                    font-weight: bold;
                    margin: 0 0 5px 0;
                }
                .alert-subtitle {
                    color: #721c24;
                    font-size: 14px;
                    margin: 0;
                }
                .report-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                    padding: 15px;
                    background-color: #fff5f5;
                    border-left: 4px solid #dc3545;
                }
                .report-title {
                    font-size: 22px;
                    font-weight: bold;
                    color: #dc3545;
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
                .summary-card.danger {
                    border-color: #dc3545;
                    background-color: #fff5f5;
                }
                .summary-value {
                    font-size: 24px;
                    font-weight: bold;
                    color: #dc3545;
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
                    background-color: #dc3545;
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
                    background-color: #fff5f5; 
                }
                .expired-row {
                    background-color: #f8d7da !important;
                }
                .currency {
                    text-align: right;
                    font-family: 'Courier New', monospace;
                }
                .center {
                    text-align: center;
                }
                .total-row {
                    background-color: #dc3545 !important;
                    color: white;
                    font-weight: bold;
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
                .urgent-notice {
                    background-color: #fff3cd;
                    border: 1px solid #ffeaa7;
                    border-radius: 5px;
                    padding: 15px;
                    margin: 20px 0;
                    color: #856404;
                }
            </style>
        </head>
        <body>
            <div class="letterhead">
                <h1 class="hospital-name">KING FAISAL HOSPITAL</h1>
                <p class="hospital-subtitle">Pharmacy & Inventory Management Department</p>
                <p class="hospital-subtitle">King faisal Hospital Rwanda | Tel: +250-XXX-XXX-XXX</p>

            </div>

            <div class="alert-banner">
                <h2 class="alert-title">⚠️ EXPIRED STOCK ALERT ⚠️</h2>
                <p class="alert-subtitle">Immediate Action Required - Disposal & Documentation</p>
            </div>

            <div class="report-header">
                <div>
                    <h2 class="report-title">EXPIRED STOCK REPORT</h2>
                    <p style="margin: 5px 0; color: #666;">Items Requiring Immediate Disposal</p>
                </div>
                <div class="report-info">
                    <p><strong>Report Date:</strong> ${currentDate}</p>
                    <p><strong>Generated:</strong> ${currentTime}</p>
                    <p><strong>Report ID:</strong> EXP-${Date.now()
                      .toString()
                      .slice(-6)}</p>
                    <p><strong>Priority:</strong> <span style="color: #dc3545; font-weight: bold;">URGENT</span></p>
                </div>
            </div>

            <div class="summary-section">
                <div class="summary-card danger">
                    <div class="summary-value">${expiredItems.length}</div>
                    <div class="summary-label">Expired Items</div>
                </div>
                <div class="summary-card danger">
                    <div class="summary-value">${totalExpiredQuantity.toLocaleString()}</div>
                    <div class="summary-label">Total Quantity</div>
                </div>
                <div class="summary-card danger">
  <div class="summary-value">
    Rwf ${totalExpiredValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
    })}
  </div>
  <div class="summary-label">Financial Loss</div>
</div>

            </div>

            ${
              expiredItems.length === 0
                ? `
                <div style="text-align: center; padding: 40px; background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; color: #155724;">
                    <h3> No Expired Items Found</h3>
                    <p>All inventory items are within their expiration dates.</p>
                </div>
            `
                : `
                <div class="urgent-notice">
                    <strong>URGENT ACTION REQUIRED:</strong> The following items have expired and must be removed from inventory immediately. 
                    Please coordinate with the disposal team and update inventory records accordingly.
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 5%;">#</th>
                            <th style="width: 30%;">Product Name</th>
                            <th style="width: 12%;">Batch Number</th>
                            <th style="width: 12%;">Expiry Date</th>
                            <th style="width: 8%;">Days Expired</th>
                            <th style="width: 8%;">Quantity</th>
                            <th style="width: 10%;">Unit Price</th>
                            <th style="width: 12%;">Loss Value</th>
                            <th style="width: 3%;">Risk</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${expiredItems
                          .map((item, index) => {
                            const expiryDate = new Date(item.expiry_date);
                            const today = new Date();
                            const daysExpired = Math.floor(
                              (today - expiryDate) / (1000 * 60 * 60 * 24)
                            );
                            const riskLevel =
                              daysExpired > 90
                                ? "HIGH"
                                : daysExpired > 30
                                ? "MED"
                                : "LOW";
                            const riskColor =
                              daysExpired > 90
                                ? "#dc3545"
                                : daysExpired > 30
                                ? "#ffc107"
                                : "#fd7e14";

                            return `
                                <tr class="expired-row">
                                    <td class="center">${index + 1}</td>
                                    <td><strong>${
                                      item.product_name || item.name || "N/A"
                                    }</strong></td>
                                    <td class="center">${
                                      item.batch_number || "-"
                                    }</td>
                                    <td class="center">${expiryDate.toLocaleDateString()}</td>
                                    <td class="center" style="color: #dc3545; font-weight: bold;">${daysExpired}</td>
                                    <td class="center">${(
                                      item.quantity || 0
                                    ).toLocaleString()}</td>
                                    <td class="currency">$${(
                                      item.unit_price || 0
                                    ).toFixed(2)}</td>
                                    <td class="currency"><strong>$${(
                                      (item.quantity || 0) *
                                      (item.unit_price || 0)
                                    ).toLocaleString("en-US", {
                                      minimumFractionDigits: 2,
                                    })}</strong></td>
                                    <td class="center" style="color: ${riskColor}; font-weight: bold; font-size: 9px;">${riskLevel}</td>
                                </tr>
                            `;
                          })
                          .join("")}
                        <tr class="total-row">
                            <td colspan="7" style="text-align: right; padding-right: 15px;">
                                <strong>TOTAL FINANCIAL LOSS:</strong>
                            </td>
                            <td class="currency">
  <strong>RWF ${totalExpiredValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
  })}</strong>
</td>

                            <td></td>
                        </tr>
                    </tbody>
                </table>
            `
            }

            <div class="signature-section">
                <div class="signature-box">
                    <div class="signature-line">
                        Prepared By<br>
                        <strong>Chief of Finance</strong>
                    </div>
                </div>
                
            </div>

            <div class="footer">
                <p><strong>CONFIDENTIAL DOCUMENT</strong> - This report contains sensitive inventory information. Expired items must be disposed of according to hospital waste management protocols.</p>
                <p>Generated automatically by KFH Inventory Management System | Report Version 2.1 | Page 1 of 1</p>
            </div>
        </body>
        </html>
    `;
};

export default generateExpiredStockReportTemplate;
