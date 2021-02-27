const axios = require('axios')

module.exports = async (ipHeader, cookie, phone, password = "Password") => {
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
        'referer': 'https://goldlion.tv/index/login/index.html',
        'accept-language': 'vi-VN,vi;q=0.9',
        'cookie': cookie,
        ...ipHeader
    }

    const data = `data%5Bmobile%5D=${phone}&data%5Bpassword%5D=${password}&data%5Bremember_pwd%5D=0`
    const options = {
        url: 'https://goldlion.tv/index/login/index',
        method: 'POST'
    }

    const response = await axios({method: options.method || 'GET', url: options.url, headers, data})
    return response.data
}
