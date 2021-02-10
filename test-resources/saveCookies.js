const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
module.exports = async function ({ pageUrl, browserWSEndpoint, saveToUrl }) {
  try {
    debugger;
    const browser = await puppeteer.connect({ browserWSEndpoint });
    const pages = await browser.pages();
    const page = await pages.find((page) => page.url() === pageUrl);

    await page.waitForSelector('body');
    debugger;
    const cookies = await page.cookies();
    debugger;
    fs.writeFileSync(path.join(__dirname, saveToUrl), JSON.stringify(cookies), {
      encoding: 'utf8',
    });
    debugger;
  } catch (error) {
    throw error;
  }
};
