const puppeteer = require('puppeteer');
const fs = require('fs');

const url = process.env.url || "https://www.delijn.be";
const user = process.env.user || "delijn@inboxbear.com";
const password = process.env.password || "DeLijn01";

(async () => {
    console.log('Using url: ' + url);

    const browser = await puppeteer.launch({
        headless: true,
        timeout: 60000
    });

    const page = await browser.newPage();
    page.setViewport({
        width: 1920,
        height: 1080
    });

    page.setCookie({
        name: 'noodberichtenCookie',
        value: '%5B12%2004%202018%2012%3A57%3A29_9336%5D',
        domain: '*.delijn.be'
    });
    
    await page.goto(url);

    await page.click('#login-btn-header');
    await page.waitForSelector('#user-login-email');

    await page.type('#user-login-email', user);
    await page.type('#user-login-password', password);
    await page.click('#loginbutton');

    let start = new Date()

    await page.waitForSelector('button#userButton span.icon.icon-caret-down', {timeout: 60000});

    let stop = new Date()
    let timing = (stop.getTime() - start.getTime()) / 1000;

    await browser.close();

    fs.appendFile('timing.txt', new Date().toISOString() + ' ' + timing + '\n' , (err) => {
        if (err) throw err;
    });
})();