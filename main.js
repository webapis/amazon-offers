const Apify = require('apify');

Apify.main(async () => {
  const { keyword } = await Apify.getInput();

  const requestQueue = await Apify.openRequestQueue();
  await requestQueue.addRequest({
    url: `https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=${keyword}`,
  });

  const handlePageFunction = async ({ request, page }) => {
    if (!request.userData.detailPage && !request.userData.offerPage) {
      let asins = await page.$$eval('div[data-asin]', (els) =>
        els
          //.filter((e, i) => i < 20)
          .map((el) => el.getAttribute('data-asin'))
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
    } else if (request.userData.detailPage) {
      const { ASIN } = request.userData;
      let title = await page.$eval('#title', (el) => el.innerText.trim());
      let url = request.url;

      let descriptionExist = await page.$('#productDescription');
      let description = null;
      if (descriptionExist) {
        description = await page.$eval('#productDescription', (el) =>
          el.innerText
            .replace(/(\r\n\t|\n|\r|\t)/gm, '')
            .replace(/^\s+|\s+$/g, '')
        );
      } else {
        description = await page.$eval('#aplus', (el) =>
          el.innerText
            .replace(/(\r\n\t|\n|\r|\t)/gm, '')
            .replace(/^\s+|\s+$/g, '')
        );
      }

      const offerRequest = new Apify.Request({
        url: `https://www.amazon.com/gp/offer-listing/${ASIN}`,
        userData: { offerPage: true, title, url, description },
      });
      requestQueue.addRequest(offerRequest);

      console.log('detail page', title);
    } else if (request.userData.offerPage) {
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

      const offersDataSet = await Apify.openDataset('offers');
      await offersDataSet.pushData({ data });
    }
  };
   //const proxyConfiguration = await Apify.createProxyConfiguration();
  const crawler = new Apify.PuppeteerCrawler({
   // maxRequestsPerCrawl: 20,
    requestQueue,
    //proxyConfiguration,
    handlePageFunction,
    launchPuppeteerOptions: {
      headless: true,
    },
  });
  await crawler.run();

});
