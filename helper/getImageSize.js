const sharp = require('sharp')

module.exports = async (image = '') => {
    const metadata = await sharp(image).metadata()
    const {width, height} = metadata

    return {
        width,
        height
    }
}
