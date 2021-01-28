const Apify = require('apify');
module.exports = async function offerPageScraper({ page, request, keyword }) {
  try {
    const { title, url, description } = request.userData;
    console.log('offer Page', title);
    //OFFERS
    // await page.waitFor(30000);
    // await page.click('body');
    await page.waitForSelector('.aod-offer');
    const data = await page.$$eval(
      '.aod-offer',
      ($offers, _title, _url, _keyword, _description) => {
        const scrapedOffers = [];
        return $offers.map(($offer) => {
          return {
            title: _title,
            url: _url,
            description: _description,
            keyword: _keyword,
            sellerName: $offer
              .querySelector(
                '#aod-offer-soldBy > div > div > div.a-fixed-left-grid-col.a-col-right > a'
              )
              .innerText.replace(/(\r\n\t|\n|\r|\t)/gm, '')
              .replace(/^\s+|\s+$/g, ''),
            price: $offer
              .querySelector('#aod-price-1 > span > span.a-offscreen')
              .innerText.replace(/(\r\n\t|\n|\r|\t)/gm, '')
              .replace(/^\s+|\s+$/g, ''),
            shipping: $offer
              .querySelector(
                '#aod-offer-price > div > div > div.a-fixed-left-grid-col.a-col-right > div > div > div.a-fixed-right-grid-col.aod-padding-right-10.a-col-left > span > span'
              )
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
//https://www.amazon.com/dp/B004OA758C/ref=olp_aod_redir#aod

//aod-offer
// price : #aod-price-1 > span > span.a-offscreen
// shipping : #aod-offer-price > div > div > div.a-fixed-left-grid-col.a-col-right > div > div > div.a-fixed-right-grid-col.aod-padding-right-10.a-col-left > span > span
// sellername : #aod-offer-soldBy > div > div > div.a-fixed-left-grid-col.a-col-right > a
