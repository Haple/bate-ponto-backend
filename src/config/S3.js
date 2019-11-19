
const aws = require('ibm-cos-sdk');

var config = {
  endpoint: 's3.us-south.cloud-object-storage.appdomain.cloud',
  apiKeyId: 'N6RVHlA5WpKXJcJE6XngeZ2WUt-KvVRpMRzvWPLaLT8a',
  ibmAuthEndpoint: 'https://iam.cloud.ibm.com/identity/token',
  serviceInstanceId: 'crn:v1:bluemix:public:cloud-object-storage:global:a/f25b4dfe109b42ad9411fd48a1e00d3d:7ed0e30a-ee7f-46cc-a514-f77f873cc424::',
};

class S3 {

  constructor(bucketName) {
    this.bucketName = bucketName;
    this.service = new aws.S3(config);
  }

  async getItem(itemName) {
    console.log(`Retrieving item from bucket: ${this.bucketName}, key: ${itemName}`);
    return this.service.getObject({
      Bucket: this.bucketName,
      Key: itemName
    }).createReadStream();
  }
}

module.exports = S3;