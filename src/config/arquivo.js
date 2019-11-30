const crypto = require('crypto');
const { extname } = require('path');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('ibm-cos-sdk');
const { IBM_ENDPOINT, IBM_API_KEY } = process.env;
const { IBM_AUTH_ENDPOINT, IBM_SERVICE_INSTANCE } = process.env;
const { IBM_ACCESS_KEY, IBM_SECRET_ACCESS_KEY } = process.env;

const s3 = new aws.S3({
  endpoint: IBM_ENDPOINT,
  apiKeyId: IBM_API_KEY,
  ibmAuthEndpoint: IBM_AUTH_ENDPOINT,
  serviceInstanceId: IBM_SERVICE_INSTANCE,
  credentials: new aws.Credentials(IBM_ACCESS_KEY, IBM_SECRET_ACCESS_KEY, sessionToken = null),
  signatureVersion: 'v4'
});

module.exports = {

  downloadItem(bucketName, itemName) {
    return s3.getObject({
      Bucket: bucketName,
      Key: itemName
    }).createReadStream();
  },

  async getDownloadUrl(bucketName, itemName, expires) {
    return await s3.getSignedUrl('getObject', {
      Bucket: bucketName,
      Key: itemName,
      Expires: expires
    });
  },

  uploadTo(bucketName) {
    return multer({
      limits: { fieldSize: 25 * 1024 * 1024, },
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
