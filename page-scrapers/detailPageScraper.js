const Apify = require('apify');
module.exports = async function detailPageScraper({ page }) {
  try {
    await page.waitForSelector('#title');

    const title = await page.$eval('#title', (el) => el.innerText.trim());
    const priceExists = await page.$('#price_inside_buybox');
    let price = 'Not avaliable';
    if (priceExists) {
      price = await page.$eval('#price_inside_buybox', (el) =>
        el.innerText.trim()
      );
    }

    const shipping = await page.$eval(
      '#exports_desktop_qualifiedBuybox_tlc_feature_div > span.a-size-base.a-color-secondary',
      (el) => el.innerText.trim()
    );
    const seller = await page.$eval(
      '#tabular-buybox-truncate-1 > span.a-truncate-cut > span',
      (el) => el.innerText.trim()
    );
    const descriptionExist = await page.$('head > meta[name=description]');
    let description = null;
    if (descriptionExist) {
      description = await page.$eval('head > meta[name=description]', (el) =>
        el
          .getAttribute('content')
          .replace(/(\r\n\t|\n|\r|\t)/gm, '')
          .replace(/^\s+|\s+$/g, '')
      );
    } else {
      throw 'Cannot find description';
    }

    return {
      title,
      description,
      price,
      shipping,
      seller,
    };
  } catch (error) {
    debugger;
    const screenshot = await page.screenshot();
    await Apify.setValue('detailPageError', screenshot, {
      contentType: 'image/png',
    });
    console.log('error origin detail page');

    throw error;
  }
};
