const Apify = require('apify');
module.exports = async function ({ page, requestQueue,productLength }) {
  try {

    debugger;
    const asins = await page.$$eval('div[data-asin]', (els,_productLength) =>
      els
        .filter((e, i) => i <= _productLength)
        .map((el) => el.getAttribute('data-asin'))
    ,productLength);
   
    asins.forEach((ASIN) => {
      if (ASIN !== '') {
        const detailRequest = new Apify.Request({
          url: `https://www.amazon.com/dp/${ASIN}`,
          userData: { detailPage: true, ASIN },
        });
        requestQueue.addRequest(detailRequest);
      }
    });
   
  } catch (error) {
      debugger;
    throw error;
  }
};
