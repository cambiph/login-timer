const puppeteer = require('puppeteer');
const fs        = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        timeout: 60000
    });

    const page = await browser.newPage();
    page.setViewport({
        width: 1920,
        height: 1080
    });

    await page.goto('https://www.delijn.be');

    await page.click('#login-btn-header');
    await page.waitForSelector('#user-login-email');

    await page.type('#user-login-email', 'delijn@inboxbear.com');
    await page.type('#user-login-password', 'DeLijn01');
    await page.click('#loginbutton');
    
    let start = new Date()
    
    await page.waitForSelector('button#userButton span.icon.icon-caret-down');
    
    let stop = new Date()
    let timing = (stop.getTime() - start.getTime()) / 1000;

    let stream = fs.createWriteStream('timing.txt', {flags: 'a'});
    stream.write(new Date().toISOString() + ' ' + timing + '\n');
    stream.end();

    await browser.close();
})();