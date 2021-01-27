const Apify = require('apify');
module.exports = async function detailPageScraper({
  request,
  page,
  requestQueue,
}) {
  try {
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
    const screenshot = await page.screenshot();
    await Apify.setValue('detailPageError', screenshot, { contentType: 'image/png' });
    console.log('error origin detail page')
    debugger;
    throw error;
  }
};
