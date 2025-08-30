import puppeteer from "puppeteer";

const convertHtmlToPdfBuffer = async (htmlContent) => {
    let browser;
    try {
        console.log("Using executable : ", puppeteer.executablePath())
        browser = await puppeteer.launch({
            // headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ],
            executablePath : puppeteer.executablePath()
        });
        
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });
        
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "20px",
                bottom: "20px",
                left: "20px",
                right: "20px"
            }
        });
        
        return pdfBuffer;
    } catch (error) {
        console.error('PDF generation error:', error);
        throw new Error(`PDF generation failed: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

export default convertHtmlToPdfBuffer