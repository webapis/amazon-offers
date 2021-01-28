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

    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({
      url: `https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=${keyword}`,
    });

    const handlePageFunction = async ({ request, page }) => {
      const isCaptchaPage = await page.$(
        'body > div > div.a-row.a-spacing-double-large > div.a-section > div > div > form > div.a-section.a-spacing-extra-large > div > span > span > button'
      );

      if (isCaptchaPage) {
        await page.reload();
      }
      if (
        request.loadedUrl ===
        `https://www.amazon.com/s?k=${keyword}&ref=nb_sb_noss`
      ) {
        await listPageScraper({ page, requestQueue, productLength });
      } else if (request.loadedUrl.match(/https:\/\/www.amazon.com\/dp\/.*/i)) {
        await detailPageScraper({ request, page, requestQueue });
      } else if (
        request.loadedUrl.match(
          /https:\/\/www.amazon.com\/gp\/offer-listing\/.*/i
        )
      ) {
        await offerPageScraper({ page, request, keyword });
      } else {
        console.log('unhandled request.loadedUrl', request.loadedUrl);
        debugger;
      }
    };

    const handleFailedRequestFunction = async ({ request }) => {
      await Apify.pushData({
        url: request.url,
        succeeded: false,
        errors: request.errorMessages,
      });
      debugger;
    };
    const crawler = new Apify.PuppeteerCrawler({
      maxConcurrency,
      requestQueue,
      handlePageFunction,
      handleFailedRequestFunction,
      preNavigationHooks: [
        async (crawlingContext, gotoOptions) => {
          debugger;
        },
      ],
      postNavigationHooks: [
        async (crawlingContext) => {
          // const { page } = crawlingContext;
          debugger;
        },
      ],
      launchPuppeteerOptions: {
        viewport: { width: 1200, height: 1200 },
        slowMo: 10,
        headless: Apify.isAtHome() ? true : false,

        args: [
          '--user-agent= 5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36 ',
        ],
      },
    });
    await crawler.run();
  } catch (error) {
    throw error;
  }
});

/*
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
     //debugger;
      if (request.userData.detailPage) {
        await detailPageScraper({ request, page, requestQueue });
      } else if (request.userData.offerPage) {
        //1611741168799.5  csm_ct
        debugger;
        await offerPageScraper({ page, request, keyword });
      }
      else if (request.url.includes('ref=olp_aod_redir#aod')){
debugger;
      }
      else if (request.url.includes('ref=olp_dp_redi')){
        debugger;
              }
      ///ref=olp_dp_redir
      else 
      
      {
        visitedList = true;

        const isCaptchaPage = await page.$(
          'body > div > div.a-row.a-spacing-double-large > div.a-section > div > div > form > div.a-section.a-spacing-extra-large > div > span > span > button'
        );
        debugger;
        if (isCaptchaPage) {
          await requestQueue.addRequest({
            url: `https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=${keyword}`,
          });
        } else {
          debugger;
          await listPageScraper({ page, requestQueue, productLength });
        }
        ///errors/validateCaptcha
        //#nav-global-location-popover-link
        if (false) {
          await page.waitForSelector('#nav-global-location-popover-link', {
            timeout: 0,
          });
          await page.click('#nav-global-location-popover-link');
          await page.waitForSelector('#GLUXZipUpdateInput', { timeout: 0 });
          await page.type('#GLUXZipUpdateInput', '90202', { delay: 100 });

          await page.waitForSelector('#GLUXZipUpdate-announce', { timeout: 0 });
          await page.click('#GLUXZipUpdate-announce');

          await page.waitForSelector(
            '#a-popover-4 > div > div.a-popover-footer > span',
            { timeout: 0 }
          );
          await page.click('#a-popover-4 > div > div.a-popover-footer > span');
        }
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
        slowMo: 10,
        headless: Apify.isAtHome() ? true : false,

        args: [
          '--user-agent= 5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36 ',
        ],
      },
    });
    await crawler.run();
  } catch (error) {
    throw error;
  }
});
*/
