const prompts = require('prompts')

module.exports = async () => {
    const response = await prompts([
        {
            type: 'text',
            name: 'cookie',
            message: 'Cookie?'
        },
        {
            type: 'text',
            name: 'captcha',
            message: 'Captcha?'
        },
    ])

    const { cookie, captcha } = response
    return { cookie, captcha }
}