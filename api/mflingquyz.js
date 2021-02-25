const axios = require('axios')

module.exports = async () => {
    const headers = {
        'authority': 'goldlion.tv',
        'content-length': '0',
        'accept': '*/*',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
        'x-requested-with': 'XMLHttpRequest',
        'origin': 'https://goldlion.tv',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'referer': 'https://goldlion.tv/index/index/index.html',
        'accept-language': 'vi-VN,vi;q=0.9',
        'cookie': 'think_var=en-us; PHPSESSID=j9d2spmpfqaa60iuj00csn2b43'
    }

    const options = {
        url: 'https://goldlion.tv/index/Index/mflingquyz',
        method: 'POST'
    }

    const response = await axios({method: options.method || 'GET', url: options.url, headers, })
    return response.data
}
