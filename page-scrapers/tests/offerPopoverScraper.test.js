var assert = require('assert');
const puppeter = require('puppeteer');
const loadPageContent = require('../../test-resources/loadPageContent');
const detailPageScraper = require('../detailPageScraper');
const offerPopoverScraper = require('../offerPopoverScraper');
describe('Test offerpopoverPageScraper', function () {
  before(async () => {
    global.browser = await puppeter.launch();
    global.page = await browser.newPage();
  });
  after(async () => {
    await page.close();
    await browser.close();
  });

  it.only('should scrape data from offer popover page', async function () {
    this.timeout(50000);
    debugger;
    const content = await loadPageContent({
      filepath: '/pages/offerPopoverPage.html',
    });
    debugger;
    await page.setRequestInterception(true);
    page.on('request', (interceptedRequest) => {
      interceptedRequest.abort();
    });
    await page.setContent(content);
    const data = await offerPopoverScraper({
      page,
      title: 'testTitle',
      description: 'test description',
    });
    debugger;
    assert.equal(6, data.length);
    debugger;
  });
});
