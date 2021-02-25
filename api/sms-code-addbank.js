const axios = require('axios')

module.exports = async (ipHeader, cookie, phone) => {
    const headers = {
        'authority': 'goldlion.tv',
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'sec-fetch-dest': 'empty',
        'x-requested-with': 'XMLHttpRequest',
        'user-agent': 'Mozilla/5.0 (MeeGo; NokiaN9) AppleWebKit/534.13 (KHTML, like Gecko) NokiaBrowser/8.5.0 Mobile Safari/534.13',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'origin': 'https://goldlion.tv',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'referer': 'https://goldlion.tv/index/user/add_payment.html',
        'accept-language': 'en-US,en;q=0.9',
        'cookie': `think_var=en-us; PHPSESSID=${cookie}`,
        ...ipHeader
    }

    const data = `data%5BareaNum%5D=84&data%5Bmobile%5D=${phone}&data%5Bscene%5D=6`
    const options = {
        url: 'https://goldlion.tv/index/Login/smsCode',
        method: 'POST'
    }

    const response = await axios({method: options.method || 'GET', url: options.url, headers, data})
    return response.data
}
