const Apify = require('apify');
module.exports = async function detailPageScraper({ page }) {
  try {
    debugger;
    await page.waitForSelector('#title');
    const title = await page.$eval('#title', (el) => el.innerText.trim());

    const descriptionExist = await page.$('head > meta[name=description]');
    let description = null;
    if (descriptionExist) {
      description = await page.$eval('head > meta[name=description]', (el) =>
        el
          .getAttribute('content')
          .replace(/(\r\n\t|\n|\r|\t)/gm, '')
          .replace(/^\s+|\s+$/g, '')
      );
    }
    // else {
    //   description = await page.$eval('#aplus', (el) =>
    //     el.innerText
    //       .replace(/(\r\n\t|\n|\r|\t)/gm, '')
    //       .replace(/^\s+|\s+$/g, '')
    //   );
    // }
    debugger;
    console.log('description........', description);
    console.log('title........', title);
    return {
      title,
      description,
    };
  } catch (error) {
    const screenshot = await page.screenshot();
    await Apify.setValue('detailPageError', screenshot, {
      contentType: 'image/png',
    });
    console.log('error origin detail page');

    throw error;
  }
};
