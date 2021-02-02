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

          userAgent: USER_AGENT,
        })
      : await getBrowser();
    browser.on('targetcreated', async (target) => {
      try {
      

        const page = await target.page();
        await page.waitForFunction("window.location.href !== 'about:blank'");
        const targetUrl = target.url();
     
        console.log('target created.............', targetUrl);
        if (targetUrl.match(DETAIL_URL_REGEX)) {
          console.log('opened detaiPage with url.......', targetUrl);
          detailUrls.push(targetUrl);
        }
      } catch (error) {
        throw error;
      }
    });

    const pageWithSearchResult = await (await browser.pages()).find(
      (p) => p.url() === `https://www.amazon.com/s?k=${keyword}&ref=nb_sb_noss`
    );
    if (pageWithSearchResult) {
      console.log(
        'page with pageWithSearchResult exists............',
        `https://www.amazon.com/s?k=${keyword}&ref=nb_sb_noss`
      );
      startPage = pageWithSearchResult;
      await startPage.bringToFront();
    } else {
      const homePage = await (await browser.pages()).find(
        (p) => p.url() === `https://www.amazon.com`
      );

      if (homePage) {
        startPage = homePage;
        await startPage.bringToFront();
        console.log('page with https://www.amazon.com is open.............');
      } else {
        startPage = await browser.newPage();
        console.log('new startPage created........................');
        await startPage.setJavaScriptEnabled(false);

        await startPage.goto('https://www.amazon.com', {
          waitUntil: 'domcontentloaded',
        });
        console.log(
          'page is navigated to https://www.amazon.com................'
        );
        const screenshot = await startPage.screenshot();
        const isCaptchaPage = await startPage.$(CAPTCHA_SELECTOR);
        await Apify.setValue('www.amazon.com1', screenshot, {
          contentType: 'image/png',
        });
        if (isCaptchaPage) {
          await startPage.reload();
        }
        await Apify.setValue('www.amazon.com2', screenshot, {
          contentType: 'image/png',
        });
        console.log('wating for searchbox to appear.................');
        await startPage.waitForSelector('#twotabsearchtextbox');

        await startPage.type('#twotabsearchtextbox', keyword, {
          delay: Math.floor(getRandomInt(50, 99)),
        });
        console.log('types the keyword into searchbox.................');

        await startPage.waitFor(getRandomInt(2, 4) * 1000);
        await startPage.click('#nav-search-submit-button');
        console.log('clicked search button.................');
      }
    }

    await startPage.setViewport({
      width: 1500,
      height: 1500,
      deviceScaleFactor: 1,
    });
    await startPage.waitFor(5000);
    const productOffers = [];
    console.log('started to collect product ids.................');
    const productIds = await getProductIds({ page: startPage, productLength });
    console.log(
      'collected product id length is.................',
      productIds.length
    );
    // open detailPages
    console.log('started opening detail pages...........');
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
          console.log(
            `clicked on product ${p} image to open detail page...........`
          );
          await clickOnElement({ page: startPage, elem: productElement });
        }
      }
    }
    console.log('total detail pages open..........', detailUrls.length);
    console.log(
      'total  pages open..........',
      await (await browser.pages()).length
    );

    const screenshotTabs = await startPage.screenshot();

    await Apify.setValue('seedetailpagetabs', screenshotTabs, {
      contentType: 'image/png',
    });
    for (const url of detailUrls) {
      if (url !== '') {
        const detailPage = await (await browser.pages()).find(
          (p) => p.url() === url
        );

        const { description, title } = await detailPageScraper({
          page: detailPage,
        });

        // await offerPageScraper({
        //   page: detailPage,
        //   title,
        //   description,
        // });
      }
    }
    const dataSet = await Apify.openDataset();
    console.log(
      'scraping is complete........ with total:',
      await dataSet.getInfo()
    );
  } catch (error) {
    console.log('error main.js');

    throw error;
  }
});
