const prompts = require('prompts')

module.exports = async () => {
    const response = await prompts([
        {
            type: 'text',
            name: 'imageName',
            message: 'Image Name?'
        },
        {
            type: 'text',
            name: 'nameCard',
            message: 'NameInCard?'
        },
        {
            type: 'text',
            name: 'idCard',
            message: 'IDInCard?'
        },
    ])

    const { imageName, nameCard, idCard } = response
    return { imageName, nameCard, idCard }
}
