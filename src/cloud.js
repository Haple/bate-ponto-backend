const AWS = require('ibm-cos-sdk');

var config = {
    endpoint: 's3.us-south.cloud-object-storage.appdomain.cloud',
    apiKeyId: 'N6RVHlA5WpKXJcJE6XngeZ2WUt-KvVRpMRzvWPLaLT8a',
    ibmAuthEndpoint: 'https://iam.cloud.ibm.com/identity/token',
    serviceInstanceId: 'crn:v1:bluemix:public:cloud-object-storage:global:a/f25b4dfe109b42ad9411fd48a1e00d3d:7ed0e30a-ee7f-46cc-a514-f77f873cc424::',
};

var cos = new AWS.S3(config);

module.exports = {

    createTextFile(bucketName, itemName, fileText) {
        console.log(`Creating new item: ${itemName}`);
        return cos.putObject({
            Bucket: bucketName, 
            Key: itemName, 
            Body: fileText
        }).promise()
        .then(() => {
            console.log(`Item: ${itemName} created!`);
        })
        .catch((e) => {
            console.error(`ERROR: ${e.code} - ${e.message}\n`);
        });
    }

};