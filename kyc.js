const Login = require('./api/login')
const SMSCode = require('./api/sms-code-addbank')
const AddPayment = require('./api/add-payment')
const Upload = require('./api/upload-base64-paycode')
const ocr = require('./api/ocr')
const Authentication = require('./api/authentication')
const {randomIPHeader, randomPhone, randomCookie, randomName, normalizeName} = require('./helper/random')
const globby = require('globby')
const _ = require('lodash')
const fs = require('fs')
const _scanFiles = async (dir) => {

    return globby([
        dir + '/*.jpg',
    ], {onlyFiles: true})
}

const _delay = async ms => {
    await new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = async (phones, password) => {
    for (let i = 0; i < phones.length; i++) {
        const phone = phones[i]
        const ipHeader = randomIPHeader()
        const cookie = randomCookie()
        console.log({cookie})
        const name = randomName()
        let response = await Login(ipHeader, cookie, phone, password)
        let {msg: msgLogin} = response
        console.log({msgLogin, phone})
        response = await SMSCode(ipHeader, phone, cookie)

        let {code: codeSMSPayment, msg: msgSMSPayment} = response

        console.log({msgSMSPayment})

        let otpSMSPayment = /Mã xác nhận(.*)/.exec(msgSMSPayment)[1]

        response = await AddPayment(ipHeader, cookie, phone, otpSMSPayment, name)

        let {code: codeAddPayment, msg: msgAddPayment} = response

        console.log({codeAddPayment, msgAddPayment})
        await _delay(1500)

        const images = await _scanFiles('./cmnd-02')

        let checkKYC = false
        while (checkKYC === false) {
            let contentImages = require('fs').readFileSync('./image_running.txt').toString()

            let imageRunning = contentImages.split('\n')
            const remainImages = _.difference(images, imageRunning)
            console.log("----------------Remain Image: ", remainImages.length)
            const image = remainImages[0]
            console.log({image})
            response = await ocr(image)

            const [info] = response.data

            if (info === undefined) {
                await fs.appendFileSync(`./image_running.txt`, image + '\n')
            } else {
                const { name, id } = info

                console.log({name, id})

                if (name === undefined) {
                    await fs.appendFileSync(`./image_running.txt`, image + '\n')
                } else {
                    const namePayload = normalizeName(name.toLowerCase(), '+', false).toUpperCase().trim()

                    response = await Upload(cookie, image)

                    const uploadedImage = response.data

                    console.log({ uploadedImage })

                    response = await Authentication(ipHeader, cookie, namePayload, id, uploadedImage)

                    const {msg: msgAuth} = response

                    if (msgAuth !== "Số CMT này đã được xác minh tên thật") {
                        console.log({msgAuth})
                        checkKYC  = true
                    }
                    console.log({response})

                    await _delay(1500)
                    await fs.appendFileSync(`./image_running.txt`, image + '\n')
                }
            }
        }
    }

}

