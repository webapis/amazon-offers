module.exports = {
  HOME_URL:
    'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=',
  USER_AGENT:
    '--user-agent= Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Mobile Safari/537.36',
  CAPTCHA_SELECTOR:
    'body > div > div.a-row.a-spacing-double-large > div.a-section > div > div > form > div.a-section.a-spacing-extra-large > div > span > span > button',
  DETAIL_URL: 'https://www.amazon.com/dp/',
  OFFER_URL: 'https://www.amazon.com/gp/offer-listing/',

  POPUP_OFFER_REGEX: /https:\/\/www.amazon.com\/dp\/.*\/ref=olp_aod_redir/i,
  OFFER_REGEX: /https:\/\/www.amazon.com\/gp\/offer-listing\/.*/i,
};
