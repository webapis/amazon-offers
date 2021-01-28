const Apify = require('apify');
const listPageScraper = require('./page-scrapers/listPageScraper');
const detailPageScraper = require('./page-scrapers/detailPageScraper');
const offerPageScraper = require('./page-scrapers/offerPageScraper');

Apify.main(async () => {
  try {
    const {
      keyword,
      maxConcurrency,
      productLength,
      proxy,
    } = await Apify.getInput();
    let visitedList = false;
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({
      url: `https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=${keyword}`,
    });

    const handlePageFunction = async ({ request, page }) => {
      if (request.userData.detailPage) {
        await detailPageScraper({ request, page, requestQueue });
      } else if (request.userData.offerPage) {
       
        //1611741168799.5  csm_ct
        await offerPageScraper({ page, request, keyword });
      } else  {
        visitedList = true;
      
        //90202
        //#nav-global-location-popover-link
        if (!Apify.isAtHome()) {
          await page.waitForSelector('#nav-global-location-popover-link', {
            timeout: 0,
          });
          await page.click('#nav-global-location-popover-link');
          await page.waitForSelector('#GLUXZipUpdateInput', { timeout: 0 });
          await page.type('#GLUXZipUpdateInput', '90202', { delay: 100 });
          debugger;
          await page.waitForSelector('#GLUXZipUpdate-announce', { timeout: 0 });
          await page.click('#GLUXZipUpdate-announce');
          debugger;
          await page.waitForSelector(
            '#a-popover-4 > div > div.a-popover-footer > span',
            { timeout: 0 }
          );
          await page.click('#a-popover-4 > div > div.a-popover-footer > span');
        }

        //GLUXConfirmClose-announce
       
  
        await listPageScraper({ page, requestQueue, productLength });
      }
    }; 
    //const proxyConfiguration = await Apify.createProxyConfiguration();

    const crawler = new Apify.PuppeteerCrawler({
      maxConcurrency,
      requestQueue,
      //proxyConfiguration,
      handlePageFunction,
      launchPuppeteerOptions: {
        viewport: { width: 1200, height: 1200 },
        slowMo:10,
        headless: Apify.isAtHome() ? true : false,

        args: [
          "--user-agent= 5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36 ",
        ],
      },
    });
    await crawler.run();
  } catch (error) {
    debugger;
    throw error;
  }
});
