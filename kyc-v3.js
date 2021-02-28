const Login = require('./api/login')
const SMSCode = require('./api/sms-code-addbank')
const AddPayment = require('./api/add-payment')
const Upload = require('./api/upload-base64-paycode')
const ocr = require('./api/ocr')
const Authentication = require('./api/authentication')
const {randomIPHeader, randomPhone, randomCookie, randomName, normalizeName} = require('./helper/random')
const globby = require('globby')
const _ = require('lodash')
const path = require('path')
const fs = require('fs')
const getUserInput = require('./helper/getUserInput')
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

        while (msgSMSPayment === "Vui lòng đợi giây lát rồi hãy gửi ") {
            await _delay(10000)
        }

        let otpSMSPayment = /Mã xác nhận(.*)/.exec(msgSMSPayment)[1]

        response = await AddPayment(ipHeader, cookie, phone, otpSMSPayment, name)

        let {code: codeAddPayment, msg: msgAddPayment} = response

        console.log({codeAddPayment, msgAddPayment})
        await _delay(1500)

        let {imageName, nameCard, idCard} = await getUserInput()
        const imageURL = path.join(__dirname, `/CMND_NEW/${imageName}`)

        let imageExist = fs.existsSync(imageURL)

        console.log({imageExist})
        while (imageExist === false) {
            console.log("ĐM nhập link ảnh cũng sai !!!!!!!!!!!")
            const {imageName: imageNew, nameCard: nameNew, idCard: idNew} = await getUserInput()
            const imageURL = path.join(__dirname, `/CMND_NEW/${imageName}`)

            imageExist = fs.existsSync(imageURL)
            imageName = imageNew
            nameCard = nameNew
            idCard = idNew
        }

        const namePayload = normalizeName(nameCard.toLowerCase(), '+', false).toUpperCase().trim()



        response = await Upload(cookie, imageURL)

        const uploadedImage = response.data

        console.log({ uploadedImage })

        response = await Authentication(ipHeader, cookie, namePayload, idCard, uploadedImage)

        const {msg: msgAuth} = response

        if (msgAuth !== "Số CMT này đã được xác minh tên thật") {
            console.log({msgAuth})
        }
        console.log({response})

        await fs.appendFileSync(`./image_running.txt`, imageName + '\n')
    }

}

