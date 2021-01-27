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
        debugger;
        //1611741168799.5  csm_ct
           await offerPageScraper({ page, request, keyword });
      } else if (!visitedList) {
        visitedList = true;
        debugger;
        //90202
        //#nav-global-location-popover-link

        await page.waitForSelector('#nav-global-location-popover-link',{timeout:0})
        await page.click('#nav-global-location-popover-link')
        await page.waitForSelector('#GLUXZipUpdateInput',{timeout:0})
        await page.type('#GLUXZipUpdateInput',"90202",{delay:100})
        debugger;
        await page.waitForSelector('#GLUXZipUpdate-announce',{timeout:0})
        await page.click('#GLUXZipUpdate-announce')
        debugger;
        await page.waitForSelector('#a-popover-4 > div > div.a-popover-footer > span',{timeout:0})
        await page.click('#a-popover-4 > div > div.a-popover-footer > span')
       
        //GLUXConfirmClose-announce
        debugger;
        // await page.click('#a-popover-4 > div > div.a-popover-footer > span > span > span > button')
        //#a-popover-4 > div > div.a-popover-footer > span > span > span > button
        await listPageScraper({ page, requestQueue, productLength });
      }
    };//#a-popover-4 > div > div.a-popover-footer > span
    //const proxyConfiguration = await Apify.createProxyConfiguration();

    const crawler = new Apify.PuppeteerCrawler({
      maxConcurrency,
      requestQueue,
      //proxyConfiguration,
      handlePageFunction,
      launchPuppeteerOptions: {
        viewport: { width: 1200, height: 1200 },

        headless: false,
        //slowMo: 2000,
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
