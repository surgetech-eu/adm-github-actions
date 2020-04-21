const AWS = require('aws-sdk');
const config = require(process.env.WORKSPACE + '/surge-ci.json')

// Setting github workflow output
console.log(`::set-output name=tag::${config.tag}`)

if (config.type == 'java-lib') {
    // If we are working with java library - checking S3 bucket
    const s3 = new AWS.S3();
    const Bucket = config.bucket;
    const Prefix = config.path + "/" + config.tag;
    const MaxKeys = 1; // If a single object is found, the folder exists.
    const params = { Bucket, Prefix, MaxKeys };

    s3.listObjectsV2(params, (err, data) => {
        const folderExists = data.Contents.length > 0;
        if (folderExists == true) {
            throw new Error("Problem: tag already exists");
        } else {
            console.log("Tag is new, ok to continue");
        }
    });

} else if (config.type == 'docker-image') {
    // Checking AWS ECR
    const ecr = new AWS.ECR({region: config.region});

    var params = { repositoryName: config.repo };
    ecr.listImages(params, function(err, data) {
        if (err) throw new Error(err, err.stack);
        else {
            for (x in data.imageIds) {
                if (data.imageIds[x].imageTag == config.tag) throw new Error("Problem: tag already exists");
            }
        console.log("Tag is new, ok to continue");
        }
    });

} else {
    // Wtf
    throw new Error("Problem: unknown artifact type");
}
