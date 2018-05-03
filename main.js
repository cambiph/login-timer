const puppeteer = require('puppeteer');
const fs = require('fs');

const url = process.env.url || "https://www.delijn.be";
const user = process.env.user || "delijn@inboxbear.com";
const password = process.env.password || "DeLijn01";

(async () => {
    try {
        const timeout = 60000;
        console.log('Using url: ' + url);
        console.log('Using timeout: ' + timeout + ' ms');

        const browser = await puppeteer.launch();

        const page = await browser.newPage();
        page.setViewport({
            width: 1920,
            height: 1080
        });

        await page.setCookie({
            'name': 'noodberichtenCookie',
            'value': '%5B12%2004%202018%2012%3A57%3A29_9336%5D',
            'domain': 'accept.delijn.be',
            'expires': Date.now() / 1000 + 10,
        });

        await page.goto(url, {timeout: timeout});

        await page.click('#login-btn-header');
        await page.waitForSelector('#user-login-email');

        await page.type('#user-login-email', user);
        await page.type('#user-login-password', password);
        await page.click('#loginbutton');

        let start = new Date();

        await page.waitForSelector('button#userButton span.icon.icon-caret-down', {
            timeout: timeout
        });

        let stop = new Date();
        let timing = (stop.getTime() - start.getTime()) / 1000;

        await browser.close();

        fs.appendFile('timing.txt', new Date().toISOString() + ' ' + timing + '\n', (err) => {
            if (err) throw err;
        });

    } catch (err) {
        console.log(err);
    }
})();