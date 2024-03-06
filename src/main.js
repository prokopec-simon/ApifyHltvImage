import { Actor } from "apify";
import { PuppeteerCrawler } from "crawlee";

await Actor.init();

const input = await Actor.getInput();
const startUrls = input?.startUrls;

const proxyConfiguration = await Actor.createProxyConfiguration({
    groups: ["RESIDENTIAL"],
    countryCode: "CZ",
});

const crawler = new PuppeteerCrawler({
    proxyConfiguration,
    async requestHandler({ page }) {
        //the start url looks like this:https://img-cdn.hltv.org/teamlogo/bEgST6XoNV4ZdenRKzCQyl.svg?ixlib=java-2.1.0&s=bd9b10a8dfe7b3640103745687389e3c
        // ineed to get the image and save it as Base64

        // Extract the SVG content
        const svgContent = await page.evaluate(() => {
            const svgElement = document.querySelector("svg");
            return svgElement.outerHTML;
        });

        // Convert the SVG content to Base64
        const base64Image = Buffer.from(svgContent).toString("base64");

        // Output the Base64 representation of the image
        console.log(`Base64 Image: ${base64Image}`);
    },
});

console.log("Running Puppeteer script...");

await crawler.run(startUrls);

console.log("Puppeteer closed.");

await Actor.exit();
