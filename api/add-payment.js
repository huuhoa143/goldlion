const axios = require('axios')

module.exports = async (ipHeader, cookie, name, phone, verify) => {
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
        'accept-language': 'vi-VN,vi;q=0.9',
        'cookie': cookie,
        ...ipHeader
    }

    const data = `data%5Bc_type%5D=T%C3%A0i+kho%E1%BA%A3n+ng%C3%A2n+h%C3%A0ng+&data%5Baccount%5D=1089${phone}41&data%5Bbank_name%5D=AMBANK&data%5BareaNum%5D=84&data%5Bmobile%5D=0969819481&data%5Bname%5D=${name}&data%5Bcode%5D=${verify}`
    const options = {
        url: 'https://goldlion.tv/index/User/add_payment',
        method: 'POST'
    }

    const response = await axios({method: options.method || 'GET', url: options.url, headers, data})
    return response.data
}
