const Apify = require('apify');
module.exports = async function detailPageScraper({
  request,
  page,
  requestQueue,
}) {
  try {
    const { ASIN } = request.userData;

    page.on('popup', async () => {});
    //#aod-close > span > span > i
    let uiChanged = await page.$('#aod-close > span > span > i');
    if (uiChanged) {
      await uiChanged.click();
    }
    await page.waitForSelector('#title');
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
    await Apify.setValue('detailPageError', screenshot, {
      contentType: 'image/png',
    });
    console.log('error origin detail page');

    throw error;
  }
};
