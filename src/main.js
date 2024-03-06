import { Actor } from 'apify';
import { PuppeteerCrawler } from 'crawlee';

await Actor.init();

const input = await Actor.getInput();

const proxyConfiguration = await Actor.createProxyConfiguration({
    groups: ['RESIDENTIAL'],
    countryCode: 'CZ',
});

const { urlTrail, imgId } = input;
const fullUrl = `https://www.hltv.org/matches/${imgId}/${urlTrail}`;

const crawler = new PuppeteerCrawler({
    proxyConfiguration,
    async requestHandler({ page }) {
        const svgContent = await page.evaluate(() => {
            const svgElement = document.querySelector('svg');
            return svgElement.outerHTML;
        });

        const base64Image = Buffer.from(svgContent).toString('base64');

        await Actor.pushData({
            status: 200,
            data: [{ img: base64Image }],
        });
    },
});

await crawler.run([fullUrl]);

await Actor.exit();
