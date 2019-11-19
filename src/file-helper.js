const sharp = require('sharp');
const fs = require('fs');
const cloud = require("./cloud");

exports.compressImage = (file, size) => {
    const newPath = file.path.split('.')[0] + '.webp';

    return sharp(file.path)
        .resize(size)
        .toFormat('webp')
        .webp({
            quality: 80
        })
        .toBuffer()
        .then(data => {

            fs.access(file.path, (err) => {
                if (!err) {
                    fs.unlink(file.path, err => {
                        if(err) console.log(err)
                    })
                }
            });

            fs.writeFile(newPath, data, err => {
                if(err){
                    throw err;
                }
            });
            cloud.createTextFile("bateponto", file.originalname, data);
            return newPath;
        })
}