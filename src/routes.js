import { Dataset, createPuppeteerRouter } from "crawlee";

export const router = createPuppeteerRouter();

router.addDefaultHandler(async ({ enqueueLinks, log }) => {
    log.info(`enqueueing new URLs`);
    await enqueueLinks({
        globs: [
            "https://img-cdn.hltv.org/teamlogo/bEgST6XoNV4ZdenRKzCQyl.svg?ixlib=java-2.1.0&s=bd9b10a8dfe7b3640103745687389e3c",
        ],
        label: "detail",
    });
});

router.addHandler("detail", async ({ request, page, log }) => {
    log.info(`enqueueing new URLs`);

    const title = await page.title();
    const content = await page.content();
    log.info(`${title}`, { url: request.loadedUrl });

    await Dataset.pushData({
        url: request.loadedUrl,
        content,
        title,
    });
});
