const SMSCode = require('./api/sms-code-register')
const Register = require('./api/register')
const fs = require('fs')
const {randomIPHeader, randomPhone, randomCookie} = require('./helper/random')

const _delay = async ms => {
    await new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = async (number, password = 'Pa55w0rds', reference) => {
    const listPhone = []
    for (let i = 0; i < number; i++) {
        const phone = randomPhone()
        const ipHeader = randomIPHeader()
        const cookie = randomCookie()
        let response = await SMSCode(ipHeader, phone, reference)
        let {code: codeSMSRegister, msg: msgSMSRegister} = response

        let otpSMSRegister = /Mã xác nhận(.*)/.exec(msgSMSRegister)[1]

        response = await Register(ipHeader, cookie, phone, password, otpSMSRegister, reference)
        let {msg} = response
        console.log({msg, phone})
        fs.appendFileSync(`./account_${reference}.txt`, phone + '\n')

        listPhone.push(phone)
        await _delay(2000)
    }

    return listPhone
}
