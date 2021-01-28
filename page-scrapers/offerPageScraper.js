const Apify = require('apify');
module.exports= async function offerPageScraper({page,request, keyword}){
    try {
      debugger;
        const { title, url, description } = request.userData;
        console.log('offer Page', title);
        //OFFERS
        const data = await page.$$eval(
          '.olpOffer',
          ($offers, _title, _url, _keyword, _description) => {
            const scrapedOffers = [];
    
            return (
              $offers
                // .filter((o, i) => i < 20)
                .map(($offer) => {
                  return {
                    title: _title,
                    url: _url,
                    description: _description,
                    keyword: _keyword,
                    sellerName: $offer
                      .querySelector('.olpDeliveryColumn')
                      .innerText.replace(/(\r\n\t|\n|\r|\t)/gm, '')
                      .replace(/^\s+|\s+$/g, ''),
                    pricePlusShipping: $offer.querySelector('.olpPriceColumn')
                      .innerText,
                  };
                })
            );
          },
          title,
          url,
          keyword,
          description
        );
    
        //const offersDataSet = await Apify.openDataset('offers');
        await Apify.pushData(data);
    } catch (error) {
      debugger;
        throw error
    }
 
}