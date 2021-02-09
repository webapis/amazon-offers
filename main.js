const Apify = require('apify');
const { handlePageFunction } = require('./page-handlers/handlePageFunction');
const { USER_AGENT } = require('./const');
Apify.main(async () => {
  try {
    const {
      keyword,
      maxConcurrency,
      productLength,
      proxy,
    } = await Apify.getInput();

    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({
      url: `https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=${keyword}`,
    });

    const crawler = new Apify.PuppeteerCrawler({
      maxRequestsPerCrawl: 10,
      requestQueue,
      maxConcurrency: 1,
      //proxyConfiguration,
      handlePageFunction: handlePageFunction({ requestQueue }),
      launchPuppeteerOptions: {
        headless: Apify.isAtHome() ? true : false,
        userAgent: USER_AGENT,
      },
    });

    await crawler.run();
  } catch (error) {
    console.log('error main.js');

    throw error;
  }
});

///Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=$(mktemp -d -t 'chrome-remote_data_dir')
