import fs from 'fs';
import path from 'path';

const uploadReportLocally = async (pdfBuffer, fileName = "report") => {
    try {
        // Create reports directory if it doesn't exist
        const reportsDir = path.join(process.cwd(), 'reports');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        // Generate unique filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fullFileName = `${fileName}_${timestamp}.pdf`;
        const filePath = path.join(reportsDir, fullFileName);

        // Write PDF buffer to file
        fs.writeFileSync(filePath, pdfBuffer);

        // Return the complete URL for frontend access
        const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        return `${baseUrl}/reports/${fullFileName}`;
    } catch (error) {
        throw new Error(`Failed to save report locally: ${error.message}`);
    }
};

export default uploadReportLocally;
