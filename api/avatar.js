const axios = require('axios')

module.exports = async (cookie, image) => {
    const headers = {
        'authority': 'goldlion.tv',
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'sec-fetch-dest': 'empty',
        'x-requested-with': 'XMLHttpRequest',
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'origin': 'https://goldlion.tv',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'referer': 'https://goldlion.tv/index/user/avatar.html',
        'accept-language': 'en-US,en;q=0.9',
        'cookie': `think_var=en-us; PHPSESSID=${cookie}`
    }

    const data = `data%5Bimgs%5D=${image}`
    const options = {
        url: 'https://goldlion.tv/index/User/avatar',
        method: 'POST'
    }

    const response = await axios({method: options.method || 'GET', url: options.url, headers, data})
    return response.data
}
