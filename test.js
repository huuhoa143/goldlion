const ocr = require('./ocr')
const Upload = require('./api/upload-base64-paycode')
const Avatar = require('./api/avatar')
const {readFile} = require('./helper/file-utils')
const {normalizeName} = require('./helper/random')
const imageToBase64 = require('image-to-base64');
const CMND = require('./generateCMND')
const globby = require('globby')
const path = require('path')
const fs = require('fs')
const cryptoRandomString = require('crypto-random-string')

const _scanFiles = async (dir) => {

    return globby(dir, {
        expandDirectories: {
            extensions: ['png', 'jpg']
        }
    });
}

const getUserInput = require('./helper/getUserInput')

setImmediate(async () => {
    const imagePath = './1 (1).jpg'
    // const imageBase64 = await imageToBase64(imagePath)
    //
    // console.log({imageBase64})
    //
    // //data%5Bimg%5D=data%3Aimage%2Fpng%3Bbase64%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
    // //data%5Bimg%5D=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAGQAAAAiCAIAAAAmgetyAAAF0UlEQVRoge2aSVMbRxTHh1SlyiGF8jHIKQfbOMEYWWGR2QqCEDY2YFahjABR2KFAbAIEmCVht0DCgACz72CIWO2wX5NTvkQOScWV48uhqaHVPZrpkSaHVPEvDq%2FfvH7d%2FOhluocQAOBuxKZPiHJPjZbwFG%2FcCaaBgu182vmybjmYnAHLeWaVeLo%2F%2F1CmPgAAwMmTCmSk2cYBoMI%2BB%2F8TjU5UqJJn3ePzK2f0PKJjOFVaUqrtojalVWp2dIri%2BchORfHTGQXSAbO89wpWXUuxotSiMu6vIaNHuyMR1nyaRnjOmhOCbx0AeN5tqInBPQvmUVUyIwUyso57bXix5CJWla4c6RcDrsvzbp53E87OevHBklSQJepfLf5JuhVxWPtuk1z3WLXr%2BEHiaW6iHgAi6tYBoOvJCP6ovONANnle8QKNqTfBRYQ5reeMvZWWzMjanZtWpRkkXeKpitkAgMBUlLQsW2W%2FNg4Asso9ATQnA2tilFxW47T6AJpRXaLzTlRHES3I6M6JB4Csck9WuSe9ZC2ARklYsScfAsjCqPn7PqtvfMOwdHyUo4V20pgexiaxtI4wEc7K6HMAeNJ7wpKBdYF3nmUQnuz0eca6gWksaorwCJgeHeYpSkVgShh%2FINjaufZfF9PRD12x57nPX9cHVmGK%2BPZhCAs1hIUq6h%2BtZ2cG2jnU9wIvdrqLkGGfqiQiEab2%2FuvpY7JoTBZN90W7yaIhgo3FkwBwmXhPdDQBgABIlBGhFNfVe1UIyJ0NMzSfC%2FbKXx%2BZjxakvrRkchz3u3NJaUWLZZTjOKfThDtLSr%2FgOM79%2Bk%2BO45ZLyvY%2BnUa2oKfWSY7j5gbyUPG3JQP%2B1DGa%2B1nU31P2XOmmc03Pp0enhGIIAIwdjxdpC0WjESnECNkfX7q89hx%2F2bebXcl2M%2B1HpJDYeYli4nxJ0R6EyRa9gVf5KnOVSDJc967%2FD6xXI%2F%2FId4gYcrvfNgk2Pvve7UcC23y0vLERnnDeGM4bI5PuPstsRDZda9F2QXikNzs0B5E9NFSIbH%2BT61VkI52h4%2FVGuPkWsnW1NYItoWtYJyld%2BIMHVT%2FSaGjP3HKcdAM0Hdozk%2FIcL0q8FuxMXx93ES%2BTRcO%2B%2Blz3wXyLoEN7aF3B2uysBoDe9UH8GQssf2pocgKAYbbPH6z7u2%2FpWrJvT%2FUVV7XwkeVvFadV2Lok2GU6nz2EhtW%2FHUVUJ6fhw%2BQIwQ4GlqD6%2BQoa1vlCNhEmiila2wEAmycxqbE%2BO%2Bma%2FhSREjDh7Ah5tf2ynUSkYitSvSuX%2FmIuB0tl3rMMYaH5%2FIBgB%2FACITqyzK4GZE%2BuxQMAz7sHjZ7SlGjGnCaLBmEa1MUIHn%2Bw5HvIMAGR5F9KESNGUq3bIktpOG9sz4oQbJwdy6nlu599LgMQJpNFc%2BaaRR51SR16t%2FwFy8Nqa06QJdWlGwGAe2NeABi%2FtBJP03c9iFE4b0ysvLrqYj%2FcCSLWJmGBN1k0W2NM93E9aT59Q6ROxl%2F4iyfEAYC5i9y2BX0dy3Smse2Oy8bgY4rGVJVmxotj30zgRX9L%2BHlZa3Z7PksPRfrDPPsEkSNr057oLzR76I1EIsdtda7t21zVyCj7%2Fup2CMekr5S%2FhJFV51Y5IkX%2FEJEftK%2BQcdzWB4wH6dst5MyS0E4kueMCQB5PnooFbfYOsSdXS43xfsfEwdMq2mlfb4aAP1ike1S4sxdknJxUMRuujKJItVI5Jt4rg3V0bA%2ByyUJdcpAZ2NW%2FcBcvbsQFcjuKSwpW7WmMxFNFqt8kr1z%2BI1lX1fl6Qki%2FZwVRWEVNE4Ldk3m9zb29M8Oe%2Ff3wJktY1lhe1YbPdzNXFPmhTFStenW%2BQXRbWgX7wNEsEXmxdyg%2FDW2ZKyp0Skw5b2uCqX6IXXhKq3r%2BlwDyOzwphIdpzZovr6adt%2Fce48WNS9W%2BnimVN6IeGdaRBtng1Acim%2B9Movjn667HA3hR%2Fqb0RoLI%2F6K5kYRuYCnQDSwF%2Bhdg0lk1gHZuRAAAAABJRU5ErkJggg%3D%3D
    // let response = await Upload("brr9gcvicf8vgrfavni4aoklo6", imageBase64)
    // console.log({response})
    // let {data, message} = response
    //
    // console.log({data})
    // response = await Avatar("brr9gcvicf8vgrfavni4aoklo6", data)
    //
    // console.log({response})

    // const name = "LÊ QUANG HƯNG"
    // const id = '118918414'
    // const image = 'public/uploads/paycode/2021022516515078036.jpeg'
    // console.log(normalizeName(name, "+", false))
    // let data = `data[real_name]=${normalizeName(name, '+', false)}&data[identity]=${id}&data[imgs]=${image}`
    // data = encodeURIComponent(data)
    //
    // console.log({data})
    // console.log(await ocr(imagePath))
    // const response = await ocr(imagePath)
    // console.log({response})
    // const [info] = response.data
    //
    // console.log(info)
    //
    // const { name, id } = info
    //
    // console.log({name, id})

    // const cmnd = await CMND("123456789", 'NGUYEN THI HOAN', '12/06/1999')
    //
    // let response = await Upload('PHPSESSID=ol68ch8tbrpn1dmo2gtkio955p; think_var=en-us;', cmnd)
    //
    // console.log({response})

    // const dirFolder = '/Users/bingxu/Documents/Ảnh/cmt'
    //
    // const images = await _scanFiles(dirFolder)
    //
    // for (let i = 0; i < images.length; i++) {
    //     console.log("Running image: ", images[i])
    //     const currentPathImage = images[i]
    //     const newPathImage = path.join(__dirname, "CMND_NEW", `cmnd_${i}.jpg`)
    //     fs.renameSync(currentPathImage, newPathImage)
    // }

    const {imageName, nameCard, idCard} = await getUserInput()
    const imageURL = path.join(__dirname, `/CMND_NEW/${imageName}`)

    console.log({imageURL, nameCard, idCard})

    // console.log(cryptoRandomString({ length: 6, type: 'numeric' }))
})
