const Apify = require('apify');
const detailPageScraper = require('./page-scrapers/detailPageScraper');
const offerPageScraper = require('./page-scrapers/offerPageScraper');
const popupOfferPageScraper = require('./page-scrapers/popupOfferPageScraper');
const getProductIds = require('./page-scrapers/getProductIds');
const {
  HOME_URL,
  USER_AGENT,
  CAPTCHA_SELECTOR,
  DETAIL_URL,
  OFFER_URL,
  POPUP_OFFER_REGEX,
  OFFER_REGEX,
} = require('./const');
const { error } = require('apify-shared/log');
Apify.main(async () => {
  try {
    const {
      keyword,
      maxConcurrency,
      productLength,
      proxy,
    } = await Apify.getInput();

    // Launch web browser.
    const browser = await Apify.launchPuppeteer({
      headless: false,
      viewport: { width: 1200, height: 1200 },
      slowMo: 10,
      args: [USER_AGENT],
    });
    const homePage = await browser.newPage();
    const productOffers = [];
    await homePage.goto(`${HOME_URL}${keyword}`);
    const isCaptchaPage = await homePage.$(CAPTCHA_SELECTOR);
    if (isCaptchaPage) {
      await homePage.reload();
    }
    const productIds = await getProductIds({ page: homePage, productLength });

    await Promise.all(
      productIds.map(async (id) => {
        const detailPage = await browser.newPage();
        const offerPage = await browser.newPage();
        await detailPage.goto(`${DETAIL_URL}${id}`, {
          waitUntil: 'domcontentloaded',
        });
        offerPage.on('domcontentloaded', async (data) => {
          const frames = await offerPage.frames();
          if (frames.length === 1 && frames[0]._url.match(POPUP_OFFER_REGEX)) {
            debugger;
            await popupOfferPageScraper({ page: offerPage });
          } else if (frames.length === 1 && frames[0]._url.match(OFFER_REGEX)) {
            debugger;
            await offerPageScraper({ page: offerPage });
          } else {
            debugger;
            throw 'domcontentloaded Error unhandled page url';
          }
        });
        await offerPage.goto(`${OFFER_URL}${id}`, {
          waitUntil: 'domcontentloaded',
        });
        const detailInfo = await detailPageScraper({ page: detailPage });
        const offerInfo = await offerPageScraper({ page: offerPage });
        productOffers.push({ ...detailInfo, ...offerInfo });
      })
    );
  } catch (error) {
    throw error;
  }
});

