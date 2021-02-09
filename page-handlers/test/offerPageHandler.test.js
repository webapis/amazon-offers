const puppeteer = require('puppeteer');
const sinon = require('sinon');
const loadPageContent = require('../../test-resources/loadPageContent');
const pageHandlers = require('../pageHandlers');
const Apify = require('apify');
const { handlePageFunction } = require('../handlePageFunction');
const sandbox = sinon.createSandbox();
describe('Test offerPageHandler', function () {
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
    this.timeout(50000);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const content = await loadPageContent({
      filepath: '/pages/offerPage.html',
    });
    debugger;
    await page.setRequestInterception(true);
    page.on('request', (interceptedRequest) => {
      interceptedRequest.abort();
    });
    debugger;
    await page.setContent(content);
    const request = {
      userData: {
        offerPage: true,
        title: 'Test Title',
        description: 'Test description',
      },
      loadedUrl: 'https://www.amazon.com',
    };
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({
      url: 'https://www.amazon.com/s?k=phone&ref=nb_sb_noss_1',
    });
    const result = await handlePageFunction({requestQueue}) ({ request, page });
    debugger;
    const offerPageHandler = await pageHandlers.offerPageHandler;
    const returnValue = await offerPageHandler.returnValues[0];
    debugger;

    const dataset = await Apify.openDataset();
    const info = await dataset.getInfo();

    sandbox.assert.match(info.itemCount, 9);
    await returnValue.drop();
    await dataset.drop();

    debugger;
  });
});
