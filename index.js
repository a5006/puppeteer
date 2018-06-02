const puppeteer = require('puppeteer');
const fs = require('fs-extra');
(async () => {
  try {
    const broser = await puppeteer.launch({
      headless: false
    });
    const page = await broser.newPage();
    page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36');
    await page.goto('https://experts.shopify.com');
    await page.waitForSelector('.section');
    const sections = await page.$$('.section');
    await fs.writeFile('out.csv', 'section,name\n');
    for (let i = 0; i < sections.length; i++) {
      await page.goto('https://experts.shopify.com');
      await page.waitForSelector('.section');
      const sections = await page.$$('.section');
      const section = sections[i];
      const button = await section.$('a.marketing-button');
      const buttonName = await page.evaluate(button => button.innerText, button);
      console.log('\n\n');
      // 点击按钮
      button.click();
      await page.waitForSelector("#ExpertsResults");
      const lis = await page.$$('#ExpertsResults>li');

      //循环每一个li
      for (const li of lis) {

        const name = await li.$eval('h2', el => el.innerText);
        console.log('name', name)
        await fs.appendFile('out.csv', `"${i}","${name}"\n`)
      }
    }
    console.log('done');
    await broser.close();
  } catch (ex) {
    console.log('our error', ex)
  }
})()
