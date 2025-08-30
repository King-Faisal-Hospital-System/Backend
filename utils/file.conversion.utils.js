import puppeteer from "puppeteer";

export const convertHtmlToPdfBuffer = async (htmlContent) => {
  let browser;
  try {
    const chromePath = puppeteer.executablePath();

    console.log("Resolved Chrome path:", chromePath);

    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
      executablePath: chromePath, // important
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    return await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
    });
  } finally {
    if (browser) await browser.close();
  }
};
