const register = require('./register')
const kyc = require('./kyc')
const _delay = async ms => {
    await new Promise(resolve => setTimeout(resolve, ms))
}
const {readFile} = require('./helper/file-utils')
setImmediate(async () => {
    const reference = '28811006'
    const total = 20

    const password = 'Pa55w0rds'
    const phones = await register(total, password, reference)
    console.log("-------------------------Đăng ký thành công, bắt đầu thêm ngân hàng và xác thực")
    await _delay(50000)
    // let content = await readFile('./account_11475202.txt')
    // content = content.split('\n')
    await kyc(phones, password)
})
