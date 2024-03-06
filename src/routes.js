import { Dataset, createPuppeteerRouter } from "crawlee";

export const router = createPuppeteerRouter();

router.addHandler(async ({ request, page, log }) => {
    log.info(await page.title());

    const title = await page.title();
    const content = await page.content();
    log.info(`${title}`, { url: request.loadedUrl });

    await Dataset.pushData({
        url: request.loadedUrl,
        content,
        title,
    });
});
