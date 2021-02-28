const sharp = require('sharp')
const path = require('path')
const TextGenerator = require('./helper/NumberGenerator')
const GetImageSize = require('./helper/getImageSize')
const GetAvatar = require('./helper/getAvatar')

module.exports = async (idArgs, nameArgs, birthDayArgs) => {
    const phoiCMND = path.join(__dirname, '/data/phoi_01.png')
    const id = await TextGenerator(idArgs)
    const name = await TextGenerator(nameArgs)
    const birthDay = await TextGenerator(birthDayArgs)
    const avatar = await GetAvatar()


    const avatarResize = await sharp(avatar)
        .resize({
            width: 135,
            height: 175
        })
        .blur(0.9)
        .toBuffer()
    const idResize = await sharp(id)
        .resize({
            width: 335,
            height: 37
        })
        .blur(0.6)
        .toBuffer()

    const nameResize = await sharp(name)
        .resize({
            width: 260,
            height: 37
        })
        .blur(0.6)
        .toBuffer()

    const birthDayResize = await sharp(birthDay)
        .resize({
            width: 260,
            height: 37
        })
        .blur(0.6)
        .toBuffer()

    const buffer = await sharp(phoiCMND)
        .composite([
            {
                input: avatarResize,
                top: 190,
                left: 119
            },
            {
                input: idResize,
                top: 132,
                left: 360
            },
            {
                input: nameResize,
                top: 167,
                left: 330
            },
            {
                input: birthDayResize,
                top: 228,
                left: 350
            }
        ])
        .toBuffer()

    return await sharp(buffer).extract({
        top: 24,
        left: 69,
        width: 600,
        height: 407
    }).toBuffer()
}
