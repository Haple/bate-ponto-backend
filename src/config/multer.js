// const AWS = require('ibm-cos-sdk');



// var cos = new AWS.S3(config);

// module.exports = {

//     createTextFile(bucketName, itemName, fileText) {
//         console.log(`Creating new item: ${itemName}`);
//         return cos.putObject({
//             Bucket: bucketName,
//             Key: itemName,
//             Body: fileText
//         }).promise()
//             .then(() => {
//                 console.log(`Item: ${itemName} created!`);
//             })
//             .catch((e) => {
//                 console.error(`ERROR: ${e.code} - ${e.message}\n`);
//             });
//     }

// };
const crypto = require('crypto');
const { extname } = require('path');
const multer = require('multer');
const multerS3 = require('multer-s3');
const myBucket = 'bateponto';
const S3 = require("./S3");

module.exports = multer({
    storage: multerS3({
        s3: new S3(myBucket).service,
        bucket: myBucket,
        key: function (req, file, cb) {
            crypto.randomBytes(16, (err, res) => {
                if (err) return cb(err);
                return cb(null, res.toString('hex') + extname(file.originalname));
            });
        }
    }),
    fileFilter: (req, file, cb) => {
        const isAccepted = ['image/png', 'image/jpg', 'image/jpeg']
            .find(formatoAceito => formatoAceito == file.mimetype);
        return cb(null, isAccepted);
    }
});