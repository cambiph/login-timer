const puppeteer = require('puppeteer');
const fs = require('fs');

const url = process.env.url || "https://www.delijn.be";
const user = process.env.user || "delijn@inboxbear.com";
const password = process.env.password || "DeLijn01";
const timeout = 1200000;

async function launchBrowser() {
    console.log('Using url: ' + url);
    console.log('Using timeout: ' + timeout + ' ms');

    const browser = await puppeteer.launch({headless: false});
    return browser;
}

async function createPage(browser) {
    const page = await browser.newPage();
    page.setViewport({
        width: 1920,
        height: 1080
    });
    return page;
}

async function setCookie(page) {
    page.setCookie({
        'name': 'noodberichtenCookie',
        'value': '%5B12%2004%202018%2012%3A57%3A29_9336%5D',
        'domain': 'accept.delijn.be',
        'expires': Date.now() / 1000 + 10,
    });
}

async function goToMainPage(page) {
    await page.goto(url, {timeout: timeout});
}

async function login(page) {
    await page.click('#login-btn-header');
    await page.waitForSelector('#user-login-email');

    await page.type('#user-login-email', user);
    await page.type('#user-login-password', password);
    await page.click('#loginbutton');
}

async function getLoginTime(page) {
    let start = new Date();

    await page.waitForSelector('button#userButton span.icon.icon-caret-down', {
        timeout: timeout
    });

    let stop = new Date();
    let timing = (stop.getTime() - start.getTime()) / 1000;
    return timing;
}

async function closeBrowser(browser) {
    await browser.close();
}

async function writeResult(timing) {
    fs.appendFile('timing.txt', new Date().toISOString() + ' ' + timing + '\n', (err) => {
        if (err) throw err;
    });
}

async function run () {
    let browser;

    try {
        browser = await launchBrowser();
        const page = await createPage(browser); 
        
        await setCookie(page);
        await goToMainPage(page);
        await login(page);

        const timing = await getLoginTime(page);

        await closeBrowser(browser);
        await writeResult(timing);

    } catch (err) {
        console.log(err);
        if(browser) { closeBrowser(browser); };
    }
};

run();