var assert = require('assert');
const puppeter = require('puppeteer');
const loadPageContent = require('../../test-resources/loadPageContent');
const detailPageScraper = require('../detailPageScraper');
const offerPageScraper = require('../offerPageScraper');
describe('Test offerPageScraper', function () {
  before(async () => {
    global.browser = await puppeter.launch();
    global.page = await browser.newPage();
  });
  after(async () => {
    await page.close();
    await browser.close();
  });


  it('should scrape data from offer page', async function () {
    this.timeout(50000);
    debugger;
    const content = await loadPageContent({
      filepath: '/pages/offerPage.html',
    });
    debugger;
    await page.setRequestInterception(true);
    page.on('request', (interceptedRequest) => {
      interceptedRequest.abort();
    });
    await page.setContent(content);
    const data = await offerPageScraper({
      page,
      title: 'testTitle',
      description: 'test description',
    });

    assert.equal(9, data.length);
    debugger;
  });
});
