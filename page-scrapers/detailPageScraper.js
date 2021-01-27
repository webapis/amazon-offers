const Apify = require('apify');
module.exports = async function detailPageScraper({
  request,
  page,
  requestQueue,
}) {
  try {
    debugger;
    const { ASIN } = request.userData;
    const title = await page.$eval('#title', (el) => el.innerText.trim());
    const url = request.url;

    const descriptionExist = await page.$('#productDescription');
    let description = null;
    if (descriptionExist) {
      description = await page.$eval('#productDescription', (el) =>
        el.innerText
          .replace(/(\r\n\t|\n|\r|\t)/gm, '')
          .replace(/^\s+|\s+$/g, '')
      );
    } else {
      description = await page.$eval('#aplus', (el) =>
        el.innerText
          .replace(/(\r\n\t|\n|\r|\t)/gm, '')
          .replace(/^\s+|\s+$/g, '')
      );
    }

    const offerRequest = new Apify.Request({
      url: `https://www.amazon.com/gp/offer-listing/${ASIN}`,
      userData: { offerPage: true, title, url, description },
    });
    requestQueue.addRequest(offerRequest);

    console.log('detail page', title);
  } catch (error) {
    debugger;
    throw error;
  }
};