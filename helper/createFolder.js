module.exports = (directory) => {
    try {
        require('fs').statSync(__dirname + '/../' + directory)
    } catch (e) {
        require('fs').mkdirSync(__dirname + '/../' + directory)
    }
}