module.exports = async function ({ page, productLength }) {
  const productIds = await page.$$eval(
    'div[data-asin]',
    (els, _productLength) =>
      els
        .filter((e, i) => i <= _productLength)

        .map((el) => el.getAttribute('data-asin')),
    productLength
  );

  return shuffle(productIds);
};

function shuffle(array) {
  const result = array.sort(() => Math.random() - 0.5);

  return result;
}
