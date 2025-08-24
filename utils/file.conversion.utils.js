import puppeteer from "puppeteer";

const convertHtmlToPdfBuffer = async (htmlContent) => {
    try {
        const browser = puppeteer.launch();
        const page = (await browser).newPage();
        (await page).setContent(htmlContent, { waitUntil: "networkidle0" });
        const pdfBuffer = (await page).pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "20px",
                bottom: "20px",
                left: "20px",
                right: "20px"
            }
        });
        (await browser).close();
        return pdfBuffer
    } catch (error) {
        throw new Error(error)
    }
};

export default convertHtmlToPdfBuffer