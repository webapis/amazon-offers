const Apify = require('apify');
module.exports = async function ({ page, requestQueue }) {
  try {
      debugger;
    const asins = await page.$$eval('div[data-asin]', (els) =>
      els
        //.filter((e, i) => i < 20)
        .map((el) => el.getAttribute('data-asin'))
    );
    debugger;
    asins.forEach((ASIN) => {
      if (ASIN !== '') {
        const detailRequest = new Apify.Request({
          url: `https://www.amazon.com/dp/${ASIN}`,
          userData: { detailPage: true, ASIN },
        });
        requestQueue.addRequest(detailRequest);
      }
    });
    debugger;
  } catch (error) {
      debugger;
    throw error;
  }
};
