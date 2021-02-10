const Apify = require('apify');
const cookies = require('../test-resources/cookies.json');
const pageHandlers = require('./pageHandlers');

function handlePageFunction({ requestQueue }) {
  return async function (args) {
    try {
      const { request, page } = args;
      debugger;

      debugger;
      //await page.setCookies(page, cookies);
      
      if (request.userData.offerPage) {
        debugger;
        return await pageHandlers.offerPageHandler({
          request,
          page,
          requestQueue,
        });
      } else if (request.userData.detailPage) {
        debugger;
        return await pageHandlers.detailPageHandler({
          request,
          page,
          requestQueue,
        });
      } else {
        debugger;
        //searchResultpage
        return await pageHandlers.searchResultPageHandler({
          request,
          page,
          requestQueue,
        });
      }
    } catch (error) {
      debugger;
      throw error;
    }
  };
}

module.exports = {
  handlePageFunction,
};
