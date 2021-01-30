module.exports = async function ({ selector, page }) {
  try {
    const elementHandlers = await page.$$(selector);
    return elementHandlers;
  } catch (error) {
    throw error;
  }
};
