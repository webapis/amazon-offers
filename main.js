const Apify = require('apify');
const listPageScraper = require('./page-scrapers/listPageScraper');
const detailPageScraper = require('./page-scrapers/detailPageScraper');
const offerPageScraper = require('./page-scrapers/offerPageScraper');

Apify.main(async () => {
  try {
    const { keyword, maxConcurrency, productLength,proxy } = await Apify.getInput();
    debugger;
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({
      url: `https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=${keyword}`,
    });

    const handlePageFunction = async ({ request, page }) => {
      if (request.userData.detailPage) {
        debugger;
        await detailPageScraper({ request, page, requestQueue });
      } else if (request.userData.offerPage) {
        debugger;
        await offerPageScraper({ page, request, keyword });
      } else {
        debugger;
        await listPageScraper({ page, requestQueue, productLength });
      }
    };
    // const proxyConfiguration = await Apify.createProxyConfiguration({
    //   groups: ['RESIDENTIAL'],
    //   countryCode: 'US',
    // });
                                         
    const crawler = new Apify.PuppeteerCrawler({
      maxConcurrency,
      requestQueue,
      proxyConfiguration:proxy,
      handlePageFunction,
      launchPuppeteerOptions: {
        headless: true,
        slowMo: 3000,
        args: [
          '--user-agent=Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Mobile Safari/537.36',
        ],
      },
    });
    await crawler.run();
  } catch (error) {
    debugger;
    throw error;
  }
});
