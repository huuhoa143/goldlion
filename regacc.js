const puppeteer = require('puppeteer-extra')
const pluginStealth = require('puppeteer-extra-plugin-stealth')
puppeteer.use(require('puppeteer-extra-plugin-anonymize-ua')())
const fs = require('fs-extra');
const path = require('path')
const RandExp = require('randexp')
const devices = require('puppeteer/DeviceDescriptors');
const SMSCode = require('./api/sms-code-register')
const SMSCodeAddBank = require('./api/sms-code-addbank')
const {randomIPHeader, randomCookie, randomName} = require('./helper/random')

function getDevice() {
    let arr = Object.keys(devices)
    console.log(parseInt(Math.random() * arr.length))

    return devices[arr[parseInt(Math.random() * arr.length)]]
}

async function initBrowser(tabId) {
    let userDataDir = './user-data' + tabId

    // if exist folder data, delete old user-data and create new user-data
    if (fs.existsSync(userDataDir)) {
        fs.removeSync(userDataDir)
    }

    fs.mkdirSync(userDataDir)

    let options = {
        headless: false,
        timeout: 50000,
        args: ['--proxy-server=zproxy.lum-superproxy.io:22225'],
        userDataDir: userDataDir,
    }
    await puppeteer.use(pluginStealth())
    return await puppeteer.launch(options)

}

async function isVisible(page, selector) {
    return page.evaluate((selector) => {
        const e = document.querySelector(selector)
        if (e) {
            const style = window.getComputedStyle(e)

            return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
        } else {
            return false;
        }
    }, selector)
}

async function initPage(browser) {
    return await browser.newPage()
}

function sleep(n) {
    return new Promise(res => setTimeout(res, n))
}


const _randomPhone = () => {
    return new RandExp(/^09[0-9]{8}$/).gen()
}

let run = async (i) => {

    let userDataDir = './user-data-' + i
    // make sure there is a folder
    if (fs.existsSync(userDataDir)) {
        fs.removeSync(userDataDir)
    }
    fs.mkdirSync(userDataDir)

    let options = {
        headless: false,
        timeout: 50000,
        userDataDir: userDataDir,
    }

    await puppeteer.use(pluginStealth())
    const browser = await puppeteer.launch(options)

    let page = await browser.newPage()
    console.log("Go to Page")
    await page.emulate(getDevice());

    try {
        const reference = '50844569'

        await page.goto(`https://goldlion.tv/index/login/register/invitecode/${reference}.html`, {waitUntil: "networkidle0", timeout: 100000});
        console.log("Wait Register Button ")
        const registerButton = await isVisible(page, "#but")
        //
        // console.log({registerButton})
        if (registerButton) {

            const phone = _randomPhone()
            const name = randomName()
            console.log({phone})
            const ipHeader = randomIPHeader()
            await page.focus("input[id=mobile]")
            await page.keyboard.type(phone)

            let response = await SMSCode(ipHeader, phone, reference)
            let {code: codeSMSRegister, msg: msgSMSRegister} = response

            let otpSMSRegister = /Mã xác nhận(.*)/.exec(msgSMSRegister)[1]

            console.log({otpSMSRegister})

            await page.$eval('body > div > div > div.weui-cells.weui-cells_form > div:nth-child(2) > div > input', (el, value) => el.value = value, otpSMSRegister);
            await page.$eval('body > div > div > div.weui-cells.weui-cells_form > div:nth-child(4) > div.weui-cell__bd > input', el => el.value = 'password123');
            await page.$eval('body > div > div > div.weui-cells.weui-cells_form > div:nth-child(5) > div.weui-cell__bd > input', el => el.value = 'password123');
            await page.$eval('#passwordtow', el => el.value = '123456');


            console.log("Click register button")
            await page.evaluate(() => {
                document.querySelector("#but").click()
            }, {waitUntil: 'networkidle0'})
            await new Promise(resolve => setTimeout(resolve, 2000))

            const pageUrl = page.url()

            console.log({pageUrl})
            const loginSuccess = pageUrl === 'https://goldlion.tv/index/login/downapp' ? 'thành công': 'thất bại'

            console.log({loginSuccess})

            if (loginSuccess) {
                fs.appendFileSync('./account.txt', phone + '\n')

                await page.goto(`https://goldlion.tv/index/login/index.html`, {waitUntil: "networkidle0", timeout: 100000});

                await page.$eval('body > div > div > div.weui-cells.weui-cells_form > div:nth-child(1) > div.weui-cell__bd > input', (el, value) => el.value = value, phone);
                await page.$eval('body > div > div > div.weui-cells.weui-cells_form > div:nth-child(2) > div.weui-cell__bd > input', el => el.value = 'password123');

                console.log("Click Login button")
                await page.evaluate(() => {
                    document.querySelector("body > div > div > div:nth-child(6) > div").click()
                }, {waitUntil: 'networkidle0'})
                await new Promise(resolve => setTimeout(resolve, 2000))

                await page.goto(`https://goldlion.tv/index/user/avatar.html`, {waitUntil: "networkidle0", timeout: 100000});

                const pathFile = path.join(__dirname, 'frontIDCard.jpg')
                // await page.click('#uploaderInput')
                // const[fileChooser] = await Promise.all([
                //     page.waitForFileChooser(),
                //     page.click('#uploaderInput'),
                // ])
                //
                // await fileChooser.accept([pathFile]);


                // await page.waitForSelector('.file-dialog-trigger')
                // await page.click('.file-dialog-trigger')
                // const input = await page.$('input[type="file"]')
                // await input.uploadFile(pathFile)

                // await page.waitForSelector('#uploaderInput')
                // await page.click('#uploaderInput')
                // const fileInput = await page.$('#uploaderInput');
                // console.log({pathFile})
                // await page.on('filedialog', async input => {
                //     await input.uploadFile(pathFile)
                // })

                // const fileInput = await page.$('input[type=file]');
                // await fileInput.uploadFile(pathFile);
                // await fileInput.evaluate(upload => upload.dispatchEvent(new Event('change', { bubbles: true })));


                // await fileInput.uploadFile(pathFile);

                // await page.goto(`https://goldlion.tv/index/user/bankcard.html`, {waitUntil: "networkidle0", timeout: 100000});
                //
                // console.log("Click Add Bank button")
                // await page.evaluate(() => {
                //     document.querySelector("body > div.page.appoint > div.page-bd > a > div").click()
                // }, {waitUntil: 'networkidle0'})
                // await new Promise(resolve => setTimeout(resolve, 2000))
                //
                // const bankInfo = `1089${phone}41`
                // await page.$eval('body > div.page.verify > div.page-bd > div.fromBox > div:nth-child(5) > div > div > input', (el, value) => el.value = value, bankInfo);
                // await page.$eval('body > div.page.verify > div.page-bd > div.fromBox > div:nth-child(7) > div > div > input', (el, value) => el.value = value, name);
                //
                // const cookies = await page.cookies()
                //
                // const goldCookie = cookies[0].value
                // console.log({goldCookie})
                //
                // let msgSMSPayment = ''
                //
                // while (msgSMSPayment === '') {
                //     console.log("Đang lấy mã SMS Bank")
                //     await new Promise(resolve => setTimeout(resolve, 15000))
                //
                //     response = await SMSCodeAddBank(ipHeader, goldCookie, phone)
                //
                //     let {code: codeSMSPayment, msg: msgSMSPaymentWait} = response
                //
                //     console.log({msgSMSPaymentWait})
                //     if (codeSMSPayment === 1) msgSMSPayment = msgSMSPaymentWait
                //
                // }
                //
                // let otpSMSPayment = /Mã xác nhận(.*)/.exec(msgSMSPayment)[1]
                //
                // console.log({otpSMSPayment})
                //
                // await page.$eval('body > div.page.verify > div.page-bd > div.fromBox > div:nth-child(12) > div > div.weui-cell__bd > input', (el, value) => el.value = value, otpSMSPayment);
                //
                // console.log("Click Confirm Add Bank button")
                // await page.evaluate(() => {
                //     document.querySelector("body > div.page.verify > div.page-bd > div.butBox > div").click()
                // }, {waitUntil: 'networkidle0'})
                // await new Promise(resolve => setTimeout(resolve, 2000))
                //
                // console.log("Go to Auth page")
                // await page.goto(`https://goldlion.tv/index/user/authentication.html`, {waitUntil: "networkidle0", timeout: 100000});
                //
                // await page.$eval('body > div > div.page-bd > div.fromBox > div:nth-child(2) > div > div > input', el => el.value = 'NGUYEN HUNG QUANG');
                // await page.$eval('body > div > div.page-bd > div.fromBox > div:nth-child(4) > div > div > input', el => el.value = '125823364');
                //
                // const fileInput = await page.$('input[type=file]');
                // await fileInput.uploadFile('./frontIDCard.png');

                // console.log("Click Confirm Auth button")
                // await page.evaluate(() => {
                //     document.querySelector("body > div > div.page-bd > div.butBox > div").click()
                // }, {waitUntil: 'networkidle0'})
                // await new Promise(resolve => setTimeout(resolve, 2000))

            }

            //
            //
            // // await page.waitFor('body > div:nth-child(12) > div > div.am-modal-wrap > div', {
            // //     visible: true,
            // //     timeout: 15000
            // // })
            //
            // await sleep(15000)

            console.log("OK")


        } else {
            console.log({registerButton})
            await browser.close()
        }
    } catch (e) {
        console.log(e.message)
        console.log("Error")
        await browser.close()
    }
}

for (let i = 0; i < 1; i++) {
    run(i)
}


//body > div.el-message-box__wrapper > div
// await page.focus("input[type=text]")
// await page.keyboard.type("mk7iapo8vp@privacy-mail.top")
// await page.focus("input[type=password]")
// await page.keyboard.type("232312q")
//
// console.log("Click button login")
//
// await page.evaluate(()=>{
//     document.getElementsByClassName("next-btn next-btn-primary next-btn-large")[0].click()
// }, {waitUntil: 'networkidle0'})
//
// await page.reload()
