const puppeteer = require('puppeteer')
const iPhone6 = puppeteer.devices['iPhone 6']
const CheckAcc = require('./api/mflingquyz')
const fs = require('fs')
const _parseOtp = string => string.match(/[0-9]{4}/gmi)[0]
const REGISTER_URL = 'https://goldlion.tv/index/login/register.html'
const LOGIN_URL = 'https://goldlion.tv/index/login/index.html'
const ADD_BANK_URL = 'https://goldlion.tv/index/user/add_payment.html'
const PHONE_INPUT = '#mobile'
const PHONE_LOGIN_INPUT = 'body > div > div > div.weui-cells.weui-cells_form > div:nth-child(1) > div.weui-cell__bd > input'
const INVITE_INPUT = '#invite'
const PASSWORD_INPUT = 'body > div > div > div.weui-cells.weui-cells_form > div:nth-child(4) > div.weui-cell__bd > input'
const RE_PASSWORD_INPUT = 'body > div > div > div.weui-cells.weui-cells_form > div:nth-child(5) > div.weui-cell__bd > input'
const LOGIN_PASSWORD_INPUT = 'body > div > div > div.weui-cells.weui-cells_form > div:nth-child(2) > div.weui-cell__bd > input'
const TRANSACTION_PASSWORD_INPUT = '#passwordtow'
const OTP_INPUT = 'body > div > div > div.weui-cells.weui-cells_form > div:nth-child(2) > div > input'
const REGISTER_BUTTON = '#but'
const LOGIN_BUTTON = 'body > div > div > div:nth-child(6) > div'
const ACCEPT_NOTI_BUTTON = '#layui-m-layer0 > div.layui-m-layermain > div > div > div.layui-m-layerbtn > span'
const RECEIVE_HOUSE_BUTTON = '#mfbut1'
const RECEIVE_HOUSE_CONFIRM_BUTTON = '#layui-m-layer2 > div.layui-m-layermain > div > div > div.layui-m-layerbtn > span:nth-child(2)'
const RECEIVE_HOUSE_CONFIRM_2_BUTTON = '#layui-m-layer3 > div.layui-m-layermain > div > div > div.layui-m-layerbtn > span:nth-child(2)'

const _type = async (puppeteerObject, selector, content) => {
    await puppeteerObject.focus(selector)

    await puppeteerObject.keyboard.type(content)
}

const _click = async (puppeteerObject, selector) => {
    await puppeteerObject.click(selector)
}

const _delay = async ms => {
    await new Promise(resolve => setTimeout(resolve, ms))
}

const _parseCookieHeader = cookies => cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ')


setImmediate(async () => {
    let content = require('fs').readFileSync('./account_0411946896.txt').toString()
    let accounts = content.split("\n")

    for (let i = 0; i < accounts.length - 1; i++) {
        console.log(`${i}/${accounts.length}`)

        const phone = accounts[i]

        if (phone) {

            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox', 'headless'],
            })
            console.log("Running")

            const page = await browser.newPage()

            await page.emulate(iPhone6)

            await page.goto(LOGIN_URL)

            await _type(page, PHONE_LOGIN_INPUT, phone)

            await _type(page, LOGIN_PASSWORD_INPUT, 'Pa55w0rds')

            await _click(page, LOGIN_BUTTON)

            await _delay(2000)

            await _click(page, ACCEPT_NOTI_BUTTON)
            await _delay(1000)

            await _click(page, RECEIVE_HOUSE_BUTTON)
            await _click(page, RECEIVE_HOUSE_CONFIRM_BUTTON)

            // await page.goto(ADD_BANK_URL)

            const cookies = await page.cookies()

            const cookieHeader = _parseCookieHeader(cookies)

            console.log({ phone, cookieHeader })

            let response = await CheckAcc(cookieHeader)

            let {code, msg} = response

            if (code === 1) {
                await _delay(2000)
                await _click(page, RECEIVE_HOUSE_CONFIRM_2_BUTTON)

                await fs.appendFileSync(`./account_success.txt`, phone + '\n')
            }
            console.log(response)

            await browser.close()

        }
    }

})
