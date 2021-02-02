const Apify = require('apify');
const clickOnElement = require('../dev-tools/clickOnElement');
module.exports = async function offerPageScraper({ page, title, description }) {
  try {
    console.log('offer Page');
    ////https://www.amazon.com/gp/offer-listing/B004OA758C/ref=dp_olp_NEW_mbc?ie=UTF8&condition=NEW

    await page.bringToFront();

    debugger;
    await page.waitForSelector('#olpOfferList');
    console.log('offer view is visible.......');
    const screenshot = await page.screenshot();

    await Apify.setValue('offerlist', screenshot, {
      contentType: 'image/png',
    });
    // const target = await page.target();
    // const opener = await target.opener();
    debugger;
    const data = await page.$$eval(
      '#olpOfferList .olpOffer',
      ($offers, _title, _description) => {
        return $offers.map(($offer) => {
          const sellerSelector = $offer.querySelector('.olpSellerName');
          const priceSelector = $offer.querySelector('.olpOfferPrice');
          const contitionSelector = $offer.querySelector('.olpCondition');
          return {
            title: _title,
            description: _description,
            seller: sellerSelector
              ? sellerSelector.innerText
                  .replace(/(\r\n\t|\n|\r|\t)/gm, '')
                  .replace(/^\s+|\s+$/g, '')
              : 'seller',
            condition: contitionSelector
              ? contitionSelector.innerText
                  .replace(/(\r\n\t|\n|\r|\t)/gm, '')
                  .replace(/^\s+|\s+$/g, '')
              : 'condition',
            price: priceSelector
              ? priceSelector.innerText
                  .replace(/(\r\n\t|\n|\r|\t)/gm, '')
                  .replace(/^\s+|\s+$/g, '')
              : 'price',
          };
        });
      },
      title,
      description
    );
    // if (data) {
    console.log('OFFER:.......');
    debugger;
    console.log('save item to dataset.....', JSON.stringify(data));
    //await Apify.pushData(data);
    // }
  } catch (error) {
    const screenshot = await page.screenshot();

    await Apify.setValue('offerPage', screenshot, {
      contentType: 'image/png',
    });
    throw error;
  }
};
