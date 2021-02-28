const sharp = require('sharp')

module.exports = async (buffer, angle = 0) => {
    const vAngle = angle ? parseInt(angle, 10) : 0

    if (vAngle === 0) return buffer

    return await sharp(buffer)
        .rotate(vAngle, {
            background: {r: 255, g: 255, b: 255, alpha: 0}
        })
        .toBuffer()
}