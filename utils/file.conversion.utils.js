import { chromium } from "playwright";
import { execSync } from "child_process";

const ensureBrowsersInstalled = async () => {
  try {
    // Check if browsers are already installed
    await chromium.executablePath();
  } catch (err) {
    console.log("Playwright browsers not found. Installing now...");
    // Install browsers
    execSync("npx playwright install chromium", { stdio: "inherit" });
  }
};

const convertHtmlToPdfBuffer = async (htmlContent) => {
  await ensureBrowsersInstalled(); // Make sure browsers are installed first

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle" });

    return await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
    });
  } finally {
    if (browser) await browser.close();
  }
};

export default convertHtmlToPdfBuffer