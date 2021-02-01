module.exports = async function ({ page, productLength }) {
  const productIds = await page.$$eval(
    'div[data-asin]',
    (els, _productLength) =>
      els
        .filter((e, i) => i <= _productLength)

        .map((el) => el.getAttribute('data-asin')),
    productLength
  );

  return shuffle(productIds.filter(p=>p !=='B01DUER6YU'));
};

function shuffle(array) {
  const result = array.sort(() => Math.random() - 0.5);

  return result;
}
