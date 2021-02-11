var assert = require('assert');
const puppeter = require('puppeteer');
const loadPageContent = require('../../test-resources/loadPageContent');
const detailPageScraper = require('../detailPageScraper');
describe('Test detailPageScraper', function () {
  before(async () => {
    global.browser = await puppeter.launch();
    global.page = await browser.newPage();
  });
  after(async () => {
    await page.close();
    await browser.close();
  });


  it('should scrape data from detailPage', async function () {
    this.timeout(50000);
    const expectedTitle =
      'VTech CS6114 DECT 6.0 Cordless Phone with Caller ID/Call Waiting, White/Grey with 1 Handset';
    const expectedDescription = `Buy VTech CS6114 DECT 6.0 Cordless Phone with Caller ID/Call Waiting, White/Grey with 1 Handset: Everything Else - Amazon.com ✓ FREE DELIVERY possible on eligible purchases`;
    const expectedShipping = '$16.83 Shipping & Import Fees Deposit to Turkey';
    const expectedPrice = '$14.97';
  
    debugger;
    const content = await loadPageContent({
      filepath: '/pages/detailPage.html',
    });
    debugger;
    await page.setRequestInterception(true);
    page.on('request', (interceptedRequest) => {
      interceptedRequest.abort();
    });
    await page.setContent(content);
    debugger;
    const { title, description, price, shipping, dataAsin } = await detailPageScraper({
      page,
    });
    assert.equal(expectedDescription, description);
    assert.equal(expectedTitle, title);
    assert.equal(expectedPrice, price);
    assert.equal(expectedShipping, shipping);

    debugger;
  });
});
