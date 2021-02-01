const Apify = require('apify');
module.exports = async function detailPageScraper({ page }) {
  try {
  
    await page.waitForSelector('#title');
    const title = await page.$eval('#title', (el) => el.innerText.trim());
 
    const descriptionExist = await page.$('#productDescription');
    let description = null;
    if (descriptionExist) {
      description = await page.$eval('#productDescription', (el) =>
        el.innerText
          .replace(/(\r\n\t|\n|\r|\t)/gm, '')
          .replace(/^\s+|\s+$/g, '')
      );
    } else {
      description = await page.$eval('#aplus', (el) =>
        el.innerText
          .replace(/(\r\n\t|\n|\r|\t)/gm, '')
          .replace(/^\s+|\s+$/g, '')
      );
    }

    console.log('detail page', title);
  
    return { title, description };
  
  } catch (error) {

    const screenshot = await page.screenshot();
    await Apify.setValue('detailPageError', screenshot, {
      contentType: 'image/png',
    });
    console.log('error origin detail page');

    throw error;
  }
};
