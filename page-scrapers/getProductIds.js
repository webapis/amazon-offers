module.exports = async function ({ page, productLength }) {
  return await page.$$eval(
    'div[data-asin]',
    (els, _productLength) =>
      els
        .filter((e, i) => i <= _productLength)
        .map((el) => el.getAttribute('data-asin')),
    productLength
  );
};
