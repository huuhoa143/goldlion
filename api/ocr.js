const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

const contentFile = fs.readFileSync(`${__dirname}/../data/ocr-api-key.txt`).toString()
const lines = contentFile.split('\n')
const API_KEY_ARRAY = lines.map(line => { if (typeof line === 'string' && line.length > 0) return line })

const _randomInteger = (max) => {
    return Math.floor(Math.random() * Math.floor(max))
}

const _getAPIKey = () => {
    return API_KEY_ARRAY[_randomInteger(API_KEY_ARRAY.length)]
}

module.exports = async (image) => {
    const apiKey = _getAPIKey()
    if (!apiKey) throw new Error('API Key not found.')
    const data = new FormData()
    data.append('image', fs.createReadStream(image))

    const config = {
        method: 'post',
        url: 'https://api.fpt.ai/vision/idr/vnm/',
        headers: {
            'api-key': apiKey,
            ...data.getHeaders()
        },
        data: data
    };

    return new Promise(async (resolve, reject) => {
        await axios(config)
            .then(function (response) {
                resolve(response.data)
            })
            .catch(function (error) {
                resolve(error.response.data)
            })
    })
}
