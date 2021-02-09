const Apify = require('apify');
const {
  utils: { enqueueLinks },
} = Apify;
const detailPageScraper = require('../page-scrapers/detailPageScraper');
const offerPageScraper = require('../page-scrapers/offerPageScraper');
async function offerPageHandler({ request, page, requestQueue }) {
  const { title, description } = request.userData;
  debugger;
  const offer = await offerPageScraper({ page, title, description });
  debugger;
  const dataset = await Apify.pushData(offer);
  debugger;

  return requestQueue;
}

async function detailPageHandler({ request, page, requestQueue, ASIN }) {
  const offerLink = await page.$(
    '#olp_feature_div span[data-action=show-all-offers-display] a'
  );

  const {
    title,
    description,
    price,
    shipping,
    seller,
  } = await detailPageScraper({
    page,
  });
  debugger;
  if (offerLink) {
    const url = `https://www.amazon.com/gp/offer-listing/${ASIN}`;
    debugger;
    const offerRequest = new Apify.Request({
      url,
      userData: { offerPage: true, ASIN, title, url, description },
    });
    await requestQueue.addRequest(offerRequest);
  } else {
    await Apify.pushData({
      title,
      description,
      price,
      shipping,
      seller,
    });
    debugger;
    //save info for single price
  }
  debugger;

  return requestQueue;
}

async function searchResultPageHandler({ request, page, requestQueue }) {
  try {
    debugger;
    const asins = await page.$$eval('div[data-asin]', (els) =>
      els.map((el) => el.getAttribute('data-asin')).filter((f) => f !== '')
    );

    await Promise.all(
      asins.map(async (ASIN) => {
        const detailRequest = new Apify.Request({
          url: `https://www.amazon.com/dp/${ASIN}`,
          userData: { detailPage: true, ASIN },
        });
        await requestQueue.addRequest(detailRequest);
      })
    );
    debugger;
    return requestQueue;
  } catch (error) {
    debugger;
    throw error;
  }
}

module.exports = {
  offerPageHandler,
  detailPageHandler,
  searchResultPageHandler,
};
