import { Actor } from 'apify';
import { PuppeteerCrawler } from 'crawlee';

await Actor.init();

const input = await Actor.getInput();

const proxyConfiguration = await Actor.createProxyConfiguration({
    groups: ['RESIDENTIAL'],
    countryCode: 'CZ',
});

const { urlTrail, imgId } = input;
const fullUrl = `https://img-cdn.hltv.org/teamlogo/${imgId}${urlTrail}`;

const crawler = new PuppeteerCrawler({
    proxyConfiguration,
    async requestHandler({ page }) {
        const isPng = fullUrl.includes('.png');

        let imageData;
        if (isPng) {
            const [response] = await Promise.all([
                page.waitForResponse((pageResponse) => pageResponse.url().includes('.png')),
                page.goto(fullUrl),
            ]);
            const buffer = await response.buffer();
            imageData = Buffer.from(buffer).toString('base64');
        } else {
            const svgContent = await page.evaluate(() => {
                const svgElement = document.querySelector('svg');
                return svgElement.outerHTML;
            });

            imageData = Buffer.from(svgContent).toString('base64');
        }

        await Actor.pushData({
            status: 200,
            data: [{ img: imageData }],
        });
    },
});

await crawler.run([fullUrl]);

await Actor.exit();
