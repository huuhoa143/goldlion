const axios = require('axios')

module.exports = async () => {
    const config = {
        method: 'get',
        url: 'https://thispersondoesnotexist.com/image',
        headers: {
            'authority': 'thispersondoesnotexist.com',
            'if-modified-since': 'Sat, 27 Feb 2021 15:42:18 GMT',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36',
            'if-none-match': '"603a685a-84b10"',
            'accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'referer': 'https://thispersondoesnotexist.com/',
            'accept-language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
            'cookie': '__cfduid=d8d8ffa1c3b5c602a7422ce0a44fcb4f61614440367; __cfduid=da01f2fb9a35b50078773bd5037a7b65c1614446792'
        },
        responseType: 'arraybuffer'
    };

    const response = await axios(config)

    return response.data
}
