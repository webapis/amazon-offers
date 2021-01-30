const Apify = require('apify');
const detailPageScraper = require('./page-scrapers/detailPageScraper');
const offerPageScraper = require('./page-scrapers/offerPageScraper');
const popupOfferPageScraper = require('./page-scrapers/popupOfferPageScraper');
const getProductIds = require('./page-scrapers/getProductIds');
const getRandomInt = require('./dev-tools/getRandomInt');
const getBrowser = require('./dev-tools/getBrowser');
const clickOnElement = require('./dev-tools/clickOnElement');
const {
  HOME_URL,
  USER_AGENT,
  CAPTCHA_SELECTOR,
  DETAIL_URL,
  OFFER_URL,
  POPUP_OFFER_REGEX,
  OFFER_REGEX,
  wsChromeEndpointurl,
  SEARCH_RESULT_URL_REGEX,
  DETAIL_URL_REGEX,
} = require('./const');

const { error, debug } = require('apify-shared/log');
Apify.main(async () => {
  try {
    const {
      keyword,
      maxConcurrency,
      productLength,
      proxy,
    } = await Apify.getInput();
    let detailUrls = [];
    let startPage = null;
    // Launch web browser.
    const browser = Apify.isAtHome()
      ? await Apify.launchPuppeteer({
          headless: false,
          viewport: { width: 1200, height: 1200 },
          slowMo: 10,
          args: [USER_AGENT],
        })
      : await getBrowser();
    browser.on('targetcreated', async (target) => {
      try {
        const targetUrl = target.url();
        if (targetUrl.match(DETAIL_URL_REGEX)) {
          detailUrls.push(targetUrl);
        }
      } catch (error) {
        debugger;
        throw error;
      }
    });

    const pageWithSearchResult = await (await browser.pages()).find(
      (p) => p.url() === `https://www.amazon.com/s?k=${keyword}&ref=nb_sb_noss`
    );
    if (pageWithSearchResult) {
      startPage = pageWithSearchResult;
      await startPage.bringToFront();
    } else {
      const homePage = await (await browser.pages()).find(
        (p) => p.url() === `https://www.amazon.com`
      );
      if (homePage) {
        startPage = homePage;
        await startPage.bringToFront();
      } else {
        startPage = await browser.newPage();
        await startPage.goto('https://www.amazon.com', {
          waitUntil: 'domcontentloaded',
        });
        await startPage.type('#twotabsearchtextbox', keyword, {
          delay: Math.floor(getRandomInt(50, 99)),
        });
        await startPage.waitFor(getRandomInt(2, 4) * 1000);
        await startPage.click('#nav-search-submit-button');
      }
    }
    await startPage.setViewport({
      width: 1500,
      height: 1500,
      deviceScaleFactor: 1,
    });
    const productOffers = [];

    // const isCaptchaPage = await homePage.$(CAPTCHA_SELECTOR);
    // if (isCaptchaPage) {
    //   await homePage.reload();
    // }
debugger;
    const productIds = await getProductIds({ page: startPage, productLength });
  //   debugger;
  //   const loadedPageUrls = await (await browser.pages()).map((p) =>
  //     p.url().substring(p.url().indexOf('/dp/') + 4, p.url().indexOf('/ref='))
  //   );
  //  debugger;
  //   const productIdToBeLoaded = productIds.filter(function filterLoaded(e) {
  //     const match = this.indexOf(e) < 0;
      
  //     return match;
  //   }, loadedPageUrls);
    debugger;
    // open detailPages
    for (const p of productIds) {
      if (p !== '') {
        await startPage.waitFor(getRandomInt(5, 10) * 1000);
        const productElement = await startPage.$(`div[data-asin=${p}] img`);
   
        if (productElement) {
          await clickOnElement({ page: startPage, elem: productElement });
        }
      }
    }
debugger;


    //deliveryMessageMirId
  } catch (error) {
    debugger;
    throw error;
  }
});

// await homePage.waitFor(Math.floor(Math.random() * 2) * 1000);
// const searchInput = await homePage.$eval(
//   '#twotabsearchtextbox',
//   (el) => el.value
// );

// const currentUrl = homePage.url();
// debugger;
// if (
//   searchInput.length > 1 &&
//   currentUrl !== `https://www.amazon.com/s?k=${keyword}&ref=nb_sb_noss`
// ) {
//   await homePage.focus('#twotabsearchtextbox');
//   await homePage.click('#twotabsearchtextbox', { clickCount: 3 });
//   await homePage.keyboard.press('Backspace');
// }
// if (searchInput.length === 0) {
//   await homePage.type('#twotabsearchtextbox', keyword, {
//     delay: Math.floor(Math.random() * 99),
//   });
//   await homePage.waitFor(Math.floor(Math.random() * 3) * 1000);
//   await homePage.click('#nav-search-submit-button');
//   //await homePage.waitForSelector('.s-result-list', { timeout: 0 });
//   await homePage.waitFor(Math.floor(Math.random() * 5) * 1000);
// }

// // const isCaptchaPage = await homePage.$(CAPTCHA_SELECTOR);
// // if (isCaptchaPage) {
// //   await homePage.reload();
// // }
// debugger;
// const productIds = await getProductIds({ page: homePage, productLength });

// const productElement = await homePage.$(
//   `div[data-asin=${productIds[0]}] img`
// );
// debugger;
// await clickOnElement({ page: homePage, elem: productElement });
// debugger;

//deliveryMessageMirId
