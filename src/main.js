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
        const status = await page.content;
        console.log(`Proxy Status: ${status}`);
    },
});

console.log("Running Puppeteer script...");

await crawler.run(startUrls);

console.log("Puppeteer closed.");

await Actor.exit();
