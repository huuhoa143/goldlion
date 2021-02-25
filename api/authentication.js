const axios = require('axios')

function randomInRange(start,end){
    return Math.floor(Math.random() * (end - start + 1) + start);
}

module.exports = async (cookie, image) => {
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

    const data = `data%5Breal_name%5D=NGUYEN+HUNG+QUANG&data%5Bidentity%5D=1258${randomInRange(11, 99)}9364&data%5Bimgs%5D=${image}`
    const options = {
        url: 'https://goldlion.tv/index/User/authentication',
        method: 'POST'
    }

    const response = await axios({method: options.method || 'GET', url: options.url, headers, data})
    return response.data
}
