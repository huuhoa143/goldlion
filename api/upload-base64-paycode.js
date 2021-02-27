
const axios = require('axios')
const imageToBase64 = require('image-to-base64')

module.exports = async (cookie, imagePath) => {
    const base64 = await imageToBase64(imagePath)

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
        'referer': 'https://goldlion.tv/index/user/avatar.html',
        'accept-language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
        'cookie': cookie
    }

    const data = `data%5Bimg%5D=data%3Aimage%2Fpng%3Bbase64%2C=${encodeURIComponent(base64)}`

    const options = {
        url: 'https://goldlion.tv/api/Upload/upload_base64_paycode',
        method: 'POST'
    }

    const response = await axios({ method: options.method || 'GET', url: options.url, headers, data })

    return response.data
}
