const puppeteer = require('puppeteer');
const express = require('express');
let browser = null;

const { USER_AGENT } = require('../const');

const app = express();
const port = 3000;

app.get('/wsendpoint', async (req, res) => {
  try {
    if (browser !== null) {
      res.send(browser.wsEndpoint());
    } else {
      browser = await puppeteer.launch({
        headless: true,
        viewport: { width: 1200, height: 1200 },
        slowMo: 15,
        args: [USER_AGENT, `--window-size=1200,1250`],
      });
      //targetdestroyed'
      browser.on('disconnected', () => {
        console.log('browser disconnected');
      });

      browser.on('targetdestroyed', async (target) => {
        const { url } = target._targetInfo;

        if (url === 'about:blank') {
          await browser.close();
          browser = null;
        }

        console.log('browser targetdestroyed');
      });
      console.log(browser.wsEndpoint());
      res.send(browser.wsEndpoint());
    }
  } catch (error) {
    throw error;
  }
});

app.listen(port, () => {
  console.log(`wsEndpoint is server is listening at http://localhost:${port}`);
});
