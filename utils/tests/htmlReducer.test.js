const { JSDOM } = require('jsdom');
describe('Test htmlReducer', function () {
  it('test', async function () {
    const filePath = process.cwd() + '/test-resources/pages/listPage.html';
    debugger;
    const dom = await JSDOM.fromFile(filePath);
    const childNodes = Array.from(dom.window.document.body.childNodes);
    const reduced = childNodes.reduce((acc, curr, i) => {
      const name = curr.nodeType;

      debugger;
    }, {});
    debugger;
  });
});
