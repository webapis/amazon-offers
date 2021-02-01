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
          headless: true,
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
    await startPage.waitFor(5000);
    const productOffers = [];

    // const isCaptchaPage = await homePage.$(CAPTCHA_SELECTOR);
    // if (isCaptchaPage) {
    //   await homePage.reload();
    // }

    const productIds = await getProductIds({ page: startPage, productLength });

    // open detailPages
    for (const p of productIds) {
      if (p !== '') {
        await startPage.waitFor(3000);
        const productElement = await startPage.$(`div[data-asin=${p}] img`);

        if (productElement) {
          await startPage.evaluate((_p) => {
            const elementToScroll = document.querySelector(
              `div[data-asin=${_p}] img`
            );
            elementToScroll.scrollIntoView();

            return Promise.resolve(true);
          }, p);

          await clickOnElement({ page: startPage, elem: productElement });
        }
      }
    }

    for (const url of detailUrls) {
      if (url !== '') {
        const detailPage = await (await browser.pages()).find(
          (p) => p.url() === url
        );

        const { description, title } = await detailPageScraper({
          page: detailPage,
        });

        await offerPageScraper({
          page: detailPage,
          title,
          description,
        });
       

        debugger;
      }
    }

    debugger;
  } catch (error) {
    debugger;
    throw error;
  }
});

