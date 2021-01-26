const Apify = require('apify');
const listPageScraper = require('./page-scrapers/listPageScraper');
const detailPageScraper = require('./page-scrapers/detailPageScraper');
const offerPageScraper = require('./page-scrapers/offerPageScraper');

Apify.main(async () => {
  try {
    const { keyword } = await Apify.getInput();
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
        await offerPageScraper({ page, request,keyword });
      } else {
        debugger;
        await listPageScraper({ page, requestQueue });
      }
    };
    //const proxyConfiguration = await Apify.createProxyConfiguration();
    const crawler = new Apify.PuppeteerCrawler({
      // maxRequestsPerCrawl: 20,
      requestQueue,
      //proxyConfiguration,
      handlePageFunction,
      launchPuppeteerOptions: {
        headless: false,
      },
    });
    await crawler.run();
  } catch (error) {
    debugger;
    throw error;
  }
});
