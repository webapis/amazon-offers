module.exports = async function clickOnElement({
  page,
  elem,
  x = null,
  y = null,
}) {
  const rect = await page.evaluate((el) => {
    const { top, left, width, height } = el.getBoundingClientRect();
    return { top, left, width, height };
  }, elem);

  // Use given position or default to center
  const _x = x !== null ? x : rect.width / 2;
  const _y = y !== null ? y : rect.height / 2;

  await page.mouse.click(rect.left + _x, rect.top + _y, { button: 'left' });
};
