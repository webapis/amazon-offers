const Apify = require('apify');
module.exports = async function ({ page, requestQueue, productLength }) {
  try {
    //https://www.amazon.com/Phone-Byeong-ki-Ahn/dp/B01DUER8JS/ref=sr_1_1?dchild=1&keywords=phone+movie&qid=1611809549&sr=8-1
    // !e.getAttribute('href').includes('1611809549')

    const asins = await page.$$eval(
      'div[data-asin]',
      (els, _productLength) =>
        els
          .filter((e, i) => i <= _productLength)
          .map((el) => el.getAttribute('data-asin')),
      productLength
    );

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
    throw error;
  }
};
