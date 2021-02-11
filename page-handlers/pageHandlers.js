const { PseudoUrl } = require('apify');
const Apify = require('apify');
const {
  utils: { enqueueLinks },
} = Apify;
const detailPageScraper = require('../page-scrapers/detailPageScraper');
const offerPageScraper = require('../page-scrapers/offerPageScraper');
const offerPopoverScraper = require('../page-scrapers/offerPopoverScraper');
async function offerPageHandler({ request, page, requestQueue }) {
  console.log('offerPageHandler....');
  const { title, description } = request.userData;
  debugger;

  const isOfferPage = await page.$('#olpOfferList');
  const isOfferPopoverPage = await page.$('#all-offers-display-scroller');
  debugger;
  if (isOfferPage) {
    debugger;
    const offer = await offerPageScraper({ page, title, description });
    debugger;
    const dataset = await Apify.pushData(offer);
  }
  if (isOfferPopoverPage) {
    debugger;
    const offer = await offerPopoverScraper({ page, title, description });
    debugger;
    const dataset = await Apify.pushData(offer);
  }

  debugger;

  return requestQueue;
}

async function detailPageHandler({ request, page, requestQueue, ASIN }) {
  console.log('detailPagehandler....');
  const { dataAsin } = request.userData;
  const { title, description } = await detailPageScraper({
    page,
  });
  debugger;
  const offerRequest = new Apify.Request({
    url: `https://www.amazon.com/dp/${dataAsin}/ref=olp_aod_redir#aod`, //`https://www.amazon.com/gp/offer-listing/${dataAsin}`,
    userData: {
      offerPage: true,
      title,
      url: `https://www.amazon.com/dp/${dataAsin}`,
      description,
    },
  });
  await requestQueue.addRequest(offerRequest);

  debugger;

  return requestQueue;
}

async function searchResultPageHandler({ request, page, requestQueue }) {
  try {
    debugger;
    console.log('searchResultPageHandler....');

    const queuedInfo = await enqueueLinks({
      limit: 10,
      page,
      requestQueue,
      selector: '.s-main-slot div[data-asin] a.a-link-normal',
      pseudoUrls: [new Apify.PseudoUrl(/.*\/dp\/.*\/ref=.*/i)],
      transformRequestFunction: (request) => {
        request.userData = { detailPage: true };
        return request;
      },
    });

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
