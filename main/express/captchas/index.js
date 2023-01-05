import axios from 'axios';
import { sleep } from '../../../utils/utils.js';
import { CAPTCHA_SERVICES } from '../../../constants/constants.js';
import solve2Captcha from './captcha2.js';
import solveRuCaptcha from './ruCaptcha.js';
import solveDBC from './dbc.js';
import solveAntiCaptcha from './anticaptcha.js';
import solveCapMonster from './capmonster.js';
import solveDevFakeCaptcha from './devFakeCaptcha.js';
import solveCapSolver from './capsolver.js';

// const googleKey = '6Lc3HAsUAAAAACsN7CgY9MMVxo2M09n_e4heJEiZ';
const siteKey = 'a010c060-9eb5-498c-a7b9-9204c881f9dc';

const urls = {
  EUW: 'https://signup.euw.leagueoflegends.com/en/signup/',
  EUNE: 'https://signup.eune.leagueoflegends.com/en/signup/',
  NA: 'https://signup.na.leagueoflegends.com/en/signup/',
  BR: 'https://signup.br.leagueoflegends.com/pt/signup/index#/',
  TR: 'https://signup.leagueoflegends.com/zh-tw/signup/index#/',
  RU: 'https://signup.ru.leagueoflegends.com/ru/signup/index#/',
  OCE: 'https://signup.oce.leagueoflegends.com/en/signup/index/',
  LAN: 'https://signup.lan.leagueoflegends.com/en/signup/index#/',
  LAS: 'https://signup.las.leagueoflegends.com/en/signup/index#/',
  JP: 'https://signup.jp.leagueoflegends.com/ja/signup/index#/',
};

const captchaByType = {
  [CAPTCHA_SERVICES.TWOCAPTCHA]: solve2Captcha,
  [CAPTCHA_SERVICES.RUCAPTCHA]: solveRuCaptcha,
  [CAPTCHA_SERVICES.DBC]: solveDBC,
  [CAPTCHA_SERVICES.ANTICAPTCHA]: solveAntiCaptcha,
  [CAPTCHA_SERVICES.CAPMONSTER]: solveCapMonster,
  [CAPTCHA_SERVICES.CAPSOLVER]: solveCapSolver,
  DEV_TEST: solveDevFakeCaptcha,
};

export default async (options) => {
  const captchaCancelToken = axios.CancelToken.source();
  sleep(5 * 60 * 1000).then(() => captchaCancelToken.cancel('CAPTCHA_TIMEOUT'));
  const token = await captchaByType[options.type]({
    ...options,
    url: urls[options.server],
    siteKey,
    captchaCancelToken,
  });
  return { mode: 'hcaptcha', text: token };
};
