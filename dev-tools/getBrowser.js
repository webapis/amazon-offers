const puppeteer = require('puppeteer');
const { USER_AGENT } = require('../const');
const getWsEndpoint = require('./getWsEndpoint');

module.exports = async function () {
  try {
    const browserWSEndpoint = await getWsEndpoint();

    return puppeteer.connect({ browserWSEndpoint });
  } catch (error) {
    throw error;
  }
};
