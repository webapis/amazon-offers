const Apify = require('apify');
module.exports = async function offerPageScraper({ page, title, description }) {
  try {
    console.log('offer Page');
    ////https://www.amazon.com/gp/offer-listing/B004OA758C/ref=dp_olp_NEW_mbc?ie=UTF8&condition=NEW

    await page.bringToFront();
    const offersExist = await page.$(
      '#olp_feature_div > div.a-section.a-spacing-small.a-spacing-top-small > span > a'
    );

    if (offersExist) {
      await page.click(
        '#olp_feature_div > div.a-section.a-spacing-small.a-spacing-top-small > span > a'
      );

      await page.waitForSelector('#aod-offer-list');

      const data = await page.$$eval(
        '#aod-offer',
        ($offers, _title, _description) => {
          return $offers.map(($offer) => {
            const sellerSelector = $offer.querySelector('#aod-offer-soldBy a');
            const priceSelector = $offer.querySelector('.a-price .a-offscreen');
            const shippingSelector = $offer.querySelector(
              '#aod-offer-price > div > div > div.a-fixed-left-grid-col.a-col-right > div > div > div.a-fixed-right-grid-col.aod-padding-right-10.a-col-left > span > span'
            );

            if (sellerSelector && priceSelector && shippingSelector) {
              return {
                title: _title,
                description: _description,
                seller: sellerSelector.innerText
                  .replace(/(\r\n\t|\n|\r|\t)/gm, '')
                  .replace(/^\s+|\s+$/g, ''),
                price: priceSelector.innerText
                  .replace(/(\r\n\t|\n|\r|\t)/gm, '')
                  .replace(/^\s+|\s+$/g, ''),
                shipping: shippingSelector.innerText
                  .replace(/(\r\n\t|\n|\r|\t)/gm, '')
                  .replace(/^\s+|\s+$/g, ''),
              };
            }
          });
        },
        title,
        description
      );

      await Apify.pushData(data);
    }
  } catch (error) {
    throw error;
  }
};
