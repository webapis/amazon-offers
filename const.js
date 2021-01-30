module.exports = {
  HOME_URL:
    'https://www.amazon.com',
  USER_AGENT:
    '--user-agent= Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36',
  CAPTCHA_SELECTOR:
    'body > div > div.a-row.a-spacing-double-large > div.a-section > div > div > form > div.a-section.a-spacing-extra-large > div > span > span > button',
  DETAIL_URL: 'https://www.amazon.com/dp/',
  OFFER_URL: 'https://www.amazon.com/gp/offer-listing/',

  POPUP_OFFER_REGEX: /https:\/\/www.amazon.com\/dp\/.*\/ref=olp_aod_redir/i,
  OFFER_REGEX: /https:\/\/www.amazon.com\/gp\/offer-listing\/.*/i,
  wsChromeEndpointurl:'ws://127.0.0.1:9222/devtools/browser/9f35a1a2-aeec-4073-b132-c7ef025634df',
  SEARCH_RESULT_URL_REGEX:/https:[-/][-/]www.amazon.com[-/].*/i,
  DETAIL_URL_REGEX:/https:[-/][-/]www.amazon.com[-/].*[-/]dp[-/].*[-/]ref=.*[?]dchild=1&keywords=.*&qid=.*&sr=.*/i
};
//    'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=',