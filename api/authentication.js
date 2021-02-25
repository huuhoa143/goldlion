const axios = require('axios')
const {normalizeName} = require('../helper/random')
module.exports = async (cookie, name, id, image) => {
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
        'referer': 'https://goldlion.tv/index/user/authentication.html',
        'accept-language': 'vi-VN,vi;q=0.9',
        'cookie': `think_var=en-us; PHPSESSID=${cookie}`
    }

    let data = `data[real_name]=${normalizeName(name, '+', false)}&data[identity]=${id}&data[imgs]=${image}`

    console.log({data})
    // data = encodeURIComponent(data)
    //
    // console.log({data})
    const options = {
        url: 'https://goldlion.tv/index/User/authentication',
        method: 'POST'
    }

    const response = await axios({method: options.method || 'GET', url: options.url, headers, data})
    return response.data
}
