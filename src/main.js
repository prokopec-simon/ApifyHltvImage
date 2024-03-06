import axios from 'axios';

import { Actor } from 'apify';

await Actor.init();

const input = await Actor.getInput();
const { url } = input;

const response = await axios
    .get(url)
    .then((response) =>
        Buffer.from(response.data, 'binary').toString('base64')
    );

await Actor.pushData(response);

await Actor.exit();

// const input: Dictionary | null = await Actor.getInput();
// if (input === null) {
//     throw new Error('Input is not defined.');
// }
// const { imgUrl, urlTrail } = input;

// const proxyConfiguration = await Actor.createProxyConfiguration({
//     groups: ['RESIDENTIAL'],
//     countryCode: 'CZ',
// });

// const fullUrl = `https://img-cdn.hltv.org/teamlogo/${imgUrl}${urlTrail}}`;

// const crawler = new CheerioCrawler({
//     maxRequestRetries: 10,
//     proxyConfiguration,
//     async requestHandler({ $ }) {
//         const pageContent = $.html();
//         await Actor.pushData({
//             status: 200,
//             data: [
//                 {
//                     pageContent: pageContent,
//                     matchUrl: fullUrl,
//                 },
//             ],
//         });
//     },
// });

// await crawler.run([fullUrl]);
// await Actor.exit();
