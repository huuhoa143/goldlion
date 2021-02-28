const {fabric} = require('fabric');

module.exports = async (svg) => {
    const canvas = new fabric.Canvas('c');

    return new Promise(resolve => {
        fabric.loadSVGFromString(svg, (objects, options) => {
            const obj = fabric.util.groupSVGElements(objects, options);
            canvas.add(obj).renderAll();

            const {width, height} = options;
            const s = canvas.toDataURL({width, height, format: 'png'});
            const base64 = s.substring(s.indexOf(';base64,') + ';base64,'.length);
            const buffer = Buffer.from(base64, 'base64');

            resolve(buffer);
        });
    });
};
