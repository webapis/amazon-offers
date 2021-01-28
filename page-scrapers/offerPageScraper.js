const Apify = require('apify');
module.exports = async function offerPageScraper({ page, request, keyword }) {
  try {
    const { title, url, description } = request.userData;
    console.log('offer Page', title);
    //OFFERS
     page.on('framenavigated',()=>{
       debugger;
     })
    await page.waitForSelector('.olpOffer');
    const data = await page.$$eval(
      '.olpOffer',
      ($offers, _title, _url, _keyword, _description) => {
        const scrapedOffers = [];

        return $offers.map(($offer) => {
          return {
            title: _title,
            url: _url,
            description: _description,
            keyword: _keyword,
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
      },
      title,
      url,
      keyword,
      description
    );

    await Apify.pushData(data);
  } catch (error) {
    throw error;
  }
};
