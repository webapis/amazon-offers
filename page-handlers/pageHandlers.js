const { PseudoUrl } = require('apify');
const Apify = require('apify');
const {
  utils: { enqueueLinks },
} = Apify;
const detailPageScraper = require('../page-scrapers/detailPageScraper');
const offerPageScraper = require('../page-scrapers/offerPageScraper');
async function offerPageHandler({ request, page, requestQueue }) {
  console.log('offerPageHandler....');
  const { title, description } = request.userData;
  debugger;
  const offer = await offerPageScraper({ page, title, description });
  debugger;
  const dataset = await Apify.pushData(offer);
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
    url: `https://www.amazon.com/gp/offer-listing/${dataAsin}`,
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
    // const asins = await page.$$eval('div[data-asin]', (els) =>
    //   els.map((el) => el.getAttribute('data-asin')).filter((f) => f !== '')
    // );
    const queuedInfo = await enqueueLinks({
      limit: 5,
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
