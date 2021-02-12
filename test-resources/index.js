const saveCookies = require('./saveCookies');

(async () => {
  const savePageContent = require('./savePageContent');
  const savePageCookies = require('./saveCookies');
  debugger;

  // await savePageContent({
  //   pageUrl: 'https://www.amazon.com/VTech-CS6114-Cordless-Waiting-Handset/dp/B004OA758C/ref=sr_1_1?dchild=1&keywords=phone&qid=1612412509&sr=8-1',
  //   browserWSEndpoint: 'ws://127.0.0.1:9222/devtools/browser/7c12dd57-db83-477b-9ed0-f0b05f761d37',
  //   saveToUrl: '/pages/detailPage.html',
  // });
  // await savePageContent({
  //   pageUrl: 'https://www.amazon.com/gp/offer-listing/B004OA758C/ref=sr_1_1_olp?keywords=phone&qid=1612412477&sr=8-1&dchild=1',
  //   browserWSEndpoint: 'ws://127.0.0.1:9222/devtools/browser/7c12dd57-db83-477b-9ed0-f0b05f761d37',
  //   saveToUrl: '/pages/offerPage.html',
  // });
  await savePageContent({
    pageUrl: 'https://www.amazon.com/s?k=phone&ref=nb_sb_noss',
    browserWSEndpoint:
      'ws://127.0.0.1:9222/devtools/browser/fa6d680b-cb32-448e-803a-d8d9c008ab73',
    saveToUrl: '/pages/listPage.html',
  });

  // await savePageCookies({
  //   pageUrl: 'https://www.amazon.com/s?k=phone&ref=nb_sb_noss_2',
  //   browserWSEndpoint:
  //     'ws://127.0.0.1:9222/devtools/browser/e73e7d55-07c6-48fd-843a-fa1dcc195cef',
  //   saveToUrl: '/cookies.json',
  //  });

  // await savePageContent({
  //   pageUrl: 'https://www.amazon.com/dp/B004OA758C/ref=olp_dp_redir',
  //   browserWSEndpoint:
  //     'ws://127.0.0.1:9222/devtools/browser/6730e955-ee51-4036-be0b-f15a14723ed3',
  //   saveToUrl: '/pages/offerPopoverPage.html',
  // });
  debugger;
})();
//#all-offers-display-scroller
