const axios = require('axios')
const { randomeBankNumber, normalizeName, randomFirstName, randomName } = require('../helper/random')

module.exports = async (ipHeader, cookie, phone, smsCode, fullName) => {
    const bankNumber = randomeBankNumber()

    const bankName = normalizeName(fullName.toLowerCase(), '+', false).toUpperCase().trim()

    const headers = {
        'authority': 'goldlion.tv',
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'x-requested-with': 'XMLHttpRequest',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'origin': 'https://goldlion.tv',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'referer': 'https://goldlion.tv/index/user/add_payment.html',
        'accept-language': 'en-US,en;q=0.9,vi;q=0.8,zh-CN;q=0.7,zh;q=0.6',
        'cookie': cookie,
        ...ipHeader
    }

    const data = `data%5Bc_type%5D=T%C3%A0i+kho%E1%BA%A3n+ng%C3%A2n+h%C3%A0ng+&data%5Baccount%5D=${bankNumber}&data%5Bbank_name%5D=BIDVBank(BIDV)&data%5BareaNum%5D=84&data%5Bmobile%5D=${phone}&data%5Bname%5D=${bankName}&data%5Bcode%5D=${smsCode}`

    const options = {
        url: 'https://goldlion.tv/index/User/add_payment',
        method: 'POST'
    }

    const response = await axios({ method: options.method || 'GET', url: options.url, headers, data })

    return {
        ...response.data,
        bankNumber,
        bankName,
        fullName,
    }
}
