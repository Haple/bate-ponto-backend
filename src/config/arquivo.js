const crypto = require('crypto');
const { extname } = require('path');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('ibm-cos-sdk');
const { IBM_ENDPOINT, IBM_API_KEY } = process.env;
const { IBM_AUTH_ENDPOINT, IBM_SERVICE_INSTANCE } = process.env;

const s3 = new aws.S3({
  endpoint: IBM_ENDPOINT,
  apiKeyId: IBM_API_KEY,
  ibmAuthEndpoint: IBM_AUTH_ENDPOINT,
  serviceInstanceId: IBM_SERVICE_INSTANCE,
});

module.exports = {

  downloadItem(bucketName, itemName) {
    return s3.getObject({
      Bucket: bucketName,
      Key: itemName
    }).createReadStream();
  },

  uploadTo(bucketName) {
    return multer({
      storage: multerS3({
        s3: s3,
        bucket: bucketName,
        key: function (req, file, cb) {
          crypto.randomBytes(16, (err, res) => {
            if (err) return cb(err);
            return cb(null,
              res.toString('hex') + extname(file.originalname));
          });
        }
      }),
      fileFilter: (req, file, cb) => {
        const isAccepted = ['image/png', 'image/jpg', 'image/jpeg']
          .find(formatoAceito => formatoAceito == file.mimetype);
        return cb(null, isAccepted);
      }
    });
  }
}
