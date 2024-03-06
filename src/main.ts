import { Actor } from 'apify';
import { CheerioCrawler, Dictionary } from 'crawlee';

await Actor.init();

const input: Dictionary | null = await Actor.getInput();
if (input === null) {
    throw new Error('Input is not defined.');
}
const { imgUrl } = input;

const proxyConfiguration = await Actor.createProxyConfiguration({
    groups: ['RESIDENTIAL'],
    countryCode: 'CZ',
});

const fullUrl = `https://img-cdn.hltv.org/teamlogo/${imgUrl}?invert=true&ixlib=java-2.1.0&sat=-100&w=100&s=df35dcf50e4bb9d73a80b5d65bd1bba9`;

const crawler = new CheerioCrawler({
    maxRequestRetries: 10,
    proxyConfiguration,
    async requestHandler({ $ }) {
        const pageContent = $.html();
        await Actor.pushData({
            status: 200,
            data: [
                {
                    pageContent: pageContent,
                    matchUrl: fullUrl,
                },
            ],
        });
    },
});

await crawler.run([fullUrl]);
await Actor.exit();
