const path = require('path')
const fs = require('fs-extra')
const sharp = require('sharp')
const _rotate = require('./rotate')
const _templatePath = path.join(__dirname, '../data/number.svg')
const _svgToBuffer = require('./svgToBuffer')

const _getTemplateContent = async () => {
    return await fs.readFile(_templatePath, {encoding: 'utf8'})
}

const _generateNumberText = async (number) => {
    const object = Object.assign({number})
    let template = await _getTemplateContent()

    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            const value = object[key]
            const regex = new RegExp(`\{${key}\}`, 'gi')

            template = template.replace(regex, value)
        }
    }

    // Nếu dùng sharp đẻ convert svg to png thì dùng hàm này
    // return Buffer.from(template)

    return _svgToBuffer(template)
}

const _generateNumber = async (mainContent, resizeWidth = null) => {
    const [svg] = await Promise.all([
        _generateNumberText(mainContent),
    ])

    const png = await sharp(svg)
        .png({quality: 100})

    const {width, height} = await png.metadata()

    const buffer = await png.toBuffer()

    if (!resizeWidth || resizeWidth < 0) {
        return buffer
    }

    const image = await sharp(buffer)
        .resize({width: resizeWidth})
        .png({quality: 100})
        .toBuffer()

    return await sharp({
        create: {
            width,
            height,
            channels: 4,
            background: "#d6cece00"
        }
    })
        .resize({width: resizeWidth})
        .png({quality: 100, compressionLevel: 9, progressive: true})
        .composite([
            {
                input: image,
                top: 0,
                left: 0,
            },
        ])
        .toBuffer()
}


module.exports = async (mainContent, resizeWidth = null, rotate = 0) => {
    const numberBuffer = await _generateNumber(mainContent, resizeWidth, rotate)

    return rotate !== 0 ? await _rotate(numberBuffer, rotate) : numberBuffer

}
