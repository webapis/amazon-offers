const puppeteer = require('puppeteer');
const sinon = require('sinon');
const loadPageContent = require('../../test-resources/loadPageContent');
const pageHandlers = require('../pageHandlers');
const Apify = require('apify');
const { handlePageFunction } = require('../handlePageFunction');
const sandbox = sinon.createSandbox();
describe('Test detailPageHandler', function () {
  before(() => {
    process.env['APIFY_LOCAL_STORAGE_DIR'] = './apify_storage';
  });
  beforeEach(() => {
    sandbox.spy(pageHandlers);
  });
  afterEach(() => {
    sandbox.restore();
  });
  it('should create request objects if offer page exist', async function () {
    this.timeout(5000);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const content = await loadPageContent({
      filepath: '/pages/detailPage.html',
    });
    debugger;
    await page.setRequestInterception(true);
    page.on('request', (interceptedRequest) => {
      interceptedRequest.abort();
    });
    debugger;
    await page.setContent(content);
    const request = {
      userData: { detailPage: true },
      loadedUrl: 'https://www.amazon.com',
    };
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({
      url: 'https://www.amazon.com/s?k=phone&ref=nb_sb_noss_1',
    });
    const result = await handlePageFunction({requestQueue}) ({ request, page });
    debugger;
    const detailPageHandler = await pageHandlers.detailPageHandler;
    const returnValue = await detailPageHandler.returnValues[0];
    debugger;
    sandbox.assert.match(returnValue.pendingCount, 2);
    await returnValue.drop();

    debugger;
  });

  it('should save an offer if only single offer exist', async function () {
    this.timeout(50000);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const content = await loadPageContent({
      filepath: '/pages/detailPage.html',
    });
    debugger;
    await page.setRequestInterception(true);
    page.on('request', (interceptedRequest) => {
      interceptedRequest.abort();
    });
    debugger;
    await page.setContent(content);
    await page.evaluate(() => {
      const offerLink = document.querySelector(
        '#olp_feature_div span[data-action=show-all-offers-display] a'
      );
      offerLink.remove();
    });
    const request = {
      userData: { detailPage: true },
      loadedUrl: 'https://www.amazon.com',
    };
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({
      url: 'https://www.amazon.com/s?k=phone&ref=nb_sb_noss_1',
    });
    const result = await handlePageFunction({requestQueue}) ({ request, page });
    debugger;
    const detailPageHandler = await pageHandlers.detailPageHandler;
    const returnValue = await detailPageHandler.returnValues[0];
    debugger;
    const dataset = await Apify.openDataset();
    const info = await dataset.getInfo();

    sandbox.assert.match(info.itemCount, 1);
    await returnValue.drop();
    await dataset.drop();
    debugger;
  });
});
