import puppeteer from "puppeteer";
import fs from "fs";

export async function convertHtmlToPdf(htmlContent, outputPath) {
    try {
        const browser = puppeteer.launch();
        const page = (await browser).newPage()
    } catch (error) {
        throw new Error(error)
    }        
}