module.exports = async function ({ page, description, title }) {
  // #all-offers-display-scroller
  // #aod-pinned-offer
  //#aod-offer-list
  // #aod-offer
  //#aod-offer-price
  //#aod-offer .a-offscreen  --price
  //#aod-offer .a-color-secondary.a-size-base   --shipping
  //#aod-offer #aod-offer-soldBy a  --seller
  //#aod-offer-heading > h5
  try {
    console.log('offerPopperPage scraping....');

    debugger;
    await page.waitForSelector('#all-offers-display-scroller');
    const data = await page.$$eval(
      '#aod-offer',
      ($offers, _title, _description) => {
        return $offers.map(($offer) => {
          const sellerSelector = $offer.querySelector('#aod-offer-soldBy a');
          const priceSelector = $offer.querySelector('.a-offscreen');
          const shippingSelector = $offer.querySelector(
            '#aod-offer-price > div > div > div.a-fixed-left-grid-col.a-col-right > div > div > div.a-fixed-right-grid-col.aod-padding-right-10.a-col-left > span > span'
          );
          const conditionSelector = $offer.querySelector(
            '#aod-offer-heading > h5'
          );
          return {
            title: _title,
            description: _description,
            seller: sellerSelector
              ? sellerSelector.innerText
                  .replace(/(\r\n\t|\n|\r|\t)/gm, '')
                  .replace(/^\s+|\s+$/g, '')
              : 'seller',
            condition: conditionSelector
              ? conditionSelector.innerText
                  .replace(/(\r\n\t|\n|\r|\t)/gm, '')
                  .replace(/^\s+|\s+$/g, '')
              : 'condition',
            price: priceSelector
              ? priceSelector.innerText
                  .replace(/(\r\n\t|\n|\r|\t)/gm, '')
                  .replace(/^\s+|\s+$/g, '')
              : 'price',
            shipping: shippingSelector
              ? shippingSelector.innerText
                  .replace(/(\r\n\t|\n|\r|\t)/gm, '')
                  .replace(/^\s+|\s+$/g, '')
              : 'not available',
          };
        });
      },
      title,
      description
    );
    return data;
  } catch (error) {
    debugger;
    throw error;
  }
};
