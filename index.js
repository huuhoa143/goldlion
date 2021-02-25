const SMSCode = require('./api/sms-code-register')
const Register = require('./api/register')
const Avatar = require('./api/avatar')
const AddPayment = require('./api/add-payment')
const IsData = require('./api/is-yuyue-data')
const Upload = require('./api/upload-base64-paycode')
const Authentication = require('./api/authentication')
const fs = require('fs')
const {randomIPHeader, randomPhone, randomCookie, randomName} = require('./helper/random')
setImmediate(async () => {
    const phone = randomPhone()
    const ipHeader = randomIPHeader()
    const cookie = randomCookie()
    const name = randomName()
    const reference = '50844569'
    let response = await SMSCode(ipHeader, phone, reference)
    let {code: codeSMSRegister, msg: msgSMSRegister} = response

    let otpSMSRegister = /Mã xác nhận(.*)/.exec(msgSMSRegister)[1]

    console.log({otpSMSRegister})
    response = await Register(ipHeader, cookie, phone, "Password", otpSMSRegister, reference)
    fs.appendFileSync('./account.txt', phone + '\n')

    response = await Upload(ipHeader, cookie)

    let {data, message} = response

    console.log({data})
    console.log({cookie})
    response = await Avatar(ipHeader, data)

    console.log({response})

    // console.log({response})
    //
    // let msgSMSPayment = ''
    //
    // while (msgSMSPayment === '') {
    //     console.log("Đang lấy mã SMS Bank")
    //     await new Promise(resolve => setTimeout(resolve, 15000))
    //
    //     response = await SMSCode(ipHeader, cookie, phone, reference, true)
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
    // response = await AddPayment(ipHeader, cookie, name, phone, otpSMSRegister)
    //
    // console.log({response})
    // let {code: codeAddPayment, msg: msgAddPayment} = response
    //
    // console.log({codeAddPayment, msgAddPayment})
    //
    // response = await Upload(ipHeader, cookie)
    //
    // let {data, message} = response
    //
    // console.log({message})
    //
    // response = await Authentication(ipHeader, cookie, data)
    //
    // console.log({response})
})
