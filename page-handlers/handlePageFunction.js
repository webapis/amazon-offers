const Apify = require('apify');
const cookies = require('../test-resources/cookies.json');
const pageHandlers = require('./pageHandlers');

function handlePageFunction({ requestQueue }) {
  return async function (args) {
    try {
      const { request, page } = args;
      debugger;

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
        return await pageHandlers.homePageHandler({
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
