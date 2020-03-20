/* eslint-disable no-await-in-loop */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const solveRecaptchaV2 = async (APIKey, googlekey, pageUrl) => {
  // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const requestUrl = `http://2captcha.com/in.php?key=${APIKey}&method=userrecaptcha&googlekey=${googlekey}&pageurl=${pageUrl}&soft_id=2622`;
  const response = await fetch(/* proxyUrl + */ requestUrl, {
    method: 'POST',
  }).catch(err => err);

  const captchaIDres = await response.text();
  const captchaID = captchaIDres.split('|')[1]; // remove 'OK|'

  const requestTokenUrl = `http://2captcha.com/res.php?key=${APIKey}&action=get&id=${captchaID}&soft_id=2622`;
  let token = await fetch(/* proxyUrl + */ requestTokenUrl, {
    method: 'GET',
  }).catch(err => err);
  token = await token.text();
  let attempt = 1;
  while (token === 'CAPCHA_NOT_READY' && attempt <= 60) {
    await sleep(5000);
    attempt += 1;
    token = await fetch(/* proxyUrl + */ requestTokenUrl, {
      method: 'GET',
    }).catch(err => err);
    token = await token.text();
  }

  [, token] = token.split('|'); // remove 'OK|'
  return token;
};

export default solveRecaptchaV2;
