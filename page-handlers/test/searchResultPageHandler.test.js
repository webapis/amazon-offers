const Apify = require('apify');
const puppeteer = require('puppeteer');
const sinon = require('sinon');
const loadPageContent = require('../../test-resources/loadPageContent');
const pageHandlers = require('../pageHandlers');
const { handlePageFunction } = require('../handlePageFunction');
const sandbox = sinon.createSandbox();
describe('Test searchResultPageHandler', function () {
  before(() => {
    sandbox.restore();
    process.env['APIFY_LOCAL_STORAGE_DIR'] = './apify_storage';
  });
  beforeEach(() => {
    sandbox.spy(pageHandlers);
  });
  afterEach(() => {
    sandbox.restore();
  });
  it.only('should create request objects for detail page crawling', async function () {
    this.timeout(50000);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const content = await loadPageContent({
      filepath: '/pages/listPage.html',
    });

    debugger;
    await page.setRequestInterception(true);
    page.on('request', (interceptedRequest) => {
      interceptedRequest.abort();
    });
    debugger;
    await page.setContent(content, { waitUntil: 'domcontentloaded' });
    const request = { userData: {} };
    debugger;

    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({
      url: 'https://www.amazon.com/s?k=phone&ref=nb_sb_noss_1',
    });
    const result = await handlePageFunction({ requestQueue })({
      request,
      page,
    });
    debugger;

    const searchResultPageHandler = await pageHandlers.searchResultPageHandler;
    debugger;
    const returnValue = await searchResultPageHandler.returnValues[0];
    debugger;
    sandbox.assert.match(returnValue.assumedTotalCount, 29);
    await returnValue.drop();
    debugger;
  });
});
