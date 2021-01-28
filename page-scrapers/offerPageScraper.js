module.exports = async function offerPageScraper({ page }) {
  try {
    console.log('offer Page');

    await page.waitForSelector('.olpOffer');
    const data = await page.$$eval('.olpOffer', ($offers) => {
      const scrapedOffers = [];

      return $offers.map(($offer) => {
        return {
          sellerName: $offer
            .querySelector('.olpDeliveryColumn')
            .innerText.replace(/(\r\n\t|\n|\r|\t)/gm, '')
            .replace(/^\s+|\s+$/g, ''),
          pricePlusShipping: $offer
            .querySelector('.olpPriceColumn')
            .innerText.replace(/(\r\n\t|\n|\r|\t)/gm, '')
            .replace(/^\s+|\s+$/g, ''),
        };
      });
    });

    return data;
  } catch (error) {
    throw error;
  }
};
