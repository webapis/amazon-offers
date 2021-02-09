const Apify = require('apify');
const sinon = require('sinon');
const pageHandlers = require('../pageHandlers');
const { handlePageFunction } = require('../handlePageFunction');
const sandbox = sinon.createSandbox();

describe('test handlePageFunction', function () {
  before(() => {
    process.env['APIFY_LOCAL_STORAGE_DIR'] = './apify_storage';
  });
  beforeEach(() => {
    sandbox.stub(pageHandlers);
  });
  afterEach(() => {
    sandbox.restore();
  });
  it('offerPageHandler should be called', async function () {
    const request = { userData: { offerPage: true } };

    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({
      url: 'https://www.amazon.com/s?k=phone&ref=nb_sb_noss_1',
    });
    const result = await handlePageFunction({ requestQueue })({
      request,
      page: {},
    });
    sandbox.assert.calledOnce(pageHandlers.offerPageHandler);
    sandbox.assert.notCalled(pageHandlers.detailPageHandler);
    sandbox.assert.notCalled(pageHandlers.searchResultPageHandler);
  });
  it('detailPageHandler should be called', async function () {
    const request = { userData: { detailPage: true } };

    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({
      url: 'https://www.amazon.com/s?k=phone&ref=nb_sb_noss_1',
    });
    const result = await handlePageFunction({ requestQueue })({
      request,
      page: {},
    });
    sandbox.assert.notCalled(pageHandlers.offerPageHandler);
    sandbox.assert.calledOnce(pageHandlers.detailPageHandler);
    sandbox.assert.notCalled(pageHandlers.searchResultPageHandler);
  });
  it('searchResultPageHandler should be called', async function () {
    const request = { userData: {} };
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({
      url: 'https://www.amazon.com/s?k=phone&ref=nb_sb_noss_1',
    });
    const result = await handlePageFunction({ requestQueue })({
      request,
      page: {},
    });
    sandbox.assert.notCalled(pageHandlers.offerPageHandler);
    sandbox.assert.notCalled(pageHandlers.detailPageHandler);
    sandbox.assert.calledOnce(pageHandlers.searchResultPageHandler);
  });
});
