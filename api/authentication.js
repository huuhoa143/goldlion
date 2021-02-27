const axios = require('axios')

const _createPayload = (name, id, imagePath) => {
    return `${encodeURI(`data[real_name]=${name}&data[identity]=${id}&data[imgs]=`)}${encodeURIComponent(imagePath)}`
}

module.exports = async (ipHeader, cookie, name, id, image) => {
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
        'accept-language': 'en-US,en;q=0.9,vi;q=0.8,zh-CN;q=0.7,zh;q=0.6',
        'cookie': cookie,
        ...ipHeader
    }

    const data = _createPayload(name, id, image)

    const options = {
        url: 'https://goldlion.tv/index/User/authentication',
        method: 'POST'
    }

    const response = await axios({ method: options.method || 'GET', url: options.url, headers, data })

    return response.data
}
