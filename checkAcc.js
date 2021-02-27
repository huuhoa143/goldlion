const { access } = require('fs')
const addPayment = require('./api/add-payment')
const puppeteer = require('puppeteer')
const iPhone6 = puppeteer.devices['iPhone 6']

const CheckAcc = require('./api/mflingquyz')
const ocr = require("./api/ocr")
const uploadImage = require("./api/upload-base64-paycode")
const authentication = require('./api/authentication')
const { normalizeName } = require('./helper/random')

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

const _getAccounts = () => {
    const content = require('fs').readFileSync('./account_76317888.txt').toString()

    const lines = content
        .split('\n')
        .filter(line => {
            if (typeof line === 'string' && line.length > 0) {
                return line
            }
        })

    const accounts = lines
        .map(line => {
            const [phone, cookie] = line.split('|')

            return { phone, cookie }
        })

    return accounts
}

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
    const accounts = _getAccounts()

    for (let i = 24; i <= accounts.length; i++) {
        console.log(`${i + 1}/${accounts.length}`)

        const { phone, cookie } = accounts[i]

        if (phone && cookie) {

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

            await _delay(3000)

            await _click(page, ACCEPT_NOTI_BUTTON)

            await _delay(3000)

            await page.goto(ADD_BANK_URL)

            const cookies = await page.cookies()

            const cookieHeader = _parseCookieHeader(cookies)

            console.log({ phone, cookieHeader })

            let response = await CheckAcc(cookieHeader)

            console.log(response)
        }
    }

})

/**
 * /Users/bingxu/Documents/go/src/crawlData/UET/1702/17020637/frontIDCard.png
 */
