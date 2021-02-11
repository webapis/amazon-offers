const Apify = require('apify');

module.exports = async function offerPageScraper({ page, title, description }) {
  try {
    console.log('offerPage scraping....');
    debugger;
    await page.waitForSelector('#olpOfferList');
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

    debugger;

    return data;
  } catch (error) {
    const screenshot = await page.screenshot();
    debugger;

    throw error;
  }
};
