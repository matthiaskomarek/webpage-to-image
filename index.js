const puppeteer = require('puppeteer');
const pages = require('./pages.json');

const timeoutPromise = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

const getFileName = (url) => {
  return url.replace('https://www.', '').replace(/\//g, '_').replace(/\./g, '-');
};

const generatePDF = async (page) => {

  for (let i = 0; i < pages.length; i++) {
    const fileName = getFileName(pages[i]);
    await page.goto(pages[i], {waitUntil: 'networkidle2'});

    await page.evaluate(() => {
      Array.from(document.querySelectorAll('.cta-box--accordion')).map((entry) => entry.classList.add('cta-box--active'));
    });

    await page.pdf({path: `./pdf/${fileName}.pdf`, format: 'A4'});
    timeoutPromise(Math.random() * 10000);
    console.log(fileName);
  }

  return true;
};

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setCookie({
    name: '_acceptCookies',
    value: 'true',
    domain: 'www.vita.ch',
    path: '/'
  });

  await generatePDF(page);
  await browser.close();
})();
