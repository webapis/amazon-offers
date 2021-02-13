const Apify = require('apify');
const { handlePageFunction } = require('./page-handlers/handlePageFunction');
const { USER_AGENT } = require('./const');
const cookies = require('./test-resources/cookies.json');
Apify.main(async () => {
  try {
    const { keyword, maxConcurrency } = await Apify.getInput();

    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({
      url: `https://www.amazon.com`,
    });

    const crawler = new Apify.PuppeteerCrawler({
      requestQueue,
      maxConcurrency,
      // preNavigationHooks: [
      //   async (crawlingContext, gotoOptions) => {
      //     const { page, browserController } = crawlingContext;
      //     await browserController.setCookies(page, cookies);
      //     console.log('preNavigationHooks');
      //   },
      // ],
      postNavigationHooks: [
        async (crawlingContext) => {
          const { page, request } = crawlingContext;
          const { userData, url } = request;
          if (userData.detailPage) {
            const dataAsin = url.substring(
              url.indexOf('/dp/') + 4,
              url.indexOf('/ref=')
            );
            console.log('postNavigationHooks');
            request.userData = { ...userData, dataAsin };
          }
        },
      ],
      handlePageFunction: handlePageFunction({ requestQueue }),
      handleFailedRequestFunction: async function ({ page, request }) {
        const screenshot = await page.screenshot();
        await Apify.setValue(request.id, screenshot, {
          contentType: 'image/png',
        });
      },
      launchContext: {
        useChrome: true,
        stealth: true,
        launchOptions: {
          slowMo: 100,
          headless: Apify.isAtHome() ? true : false,
          args: [`--user-agent=${USER_AGENT}`],
        },
      },
    });

    await crawler.run();
  } catch (error) {
    console.log('error main.js', error);
  }
});
//
///Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=$(mktemp -d -t 'chrome-remote_data_dir')
