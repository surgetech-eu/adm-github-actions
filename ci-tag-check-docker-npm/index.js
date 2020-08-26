const AWS = require('aws-sdk')
const fs = require('fs')

const config = require(process.env.GITHUB_WORKSPACE + '/package.json')
var tag = config.version
var repo = config.name

// get short branch name
var branch = process.env.GITHUB_REF.replace(/refs\/heads\//gm,'')

// set github workflow output
console.log(`::set-output name=tag::${tag}`)
console.log(`::set-output name=repo::${repo}`)
console.log(`::set-output name=branch::${branch}`)

// we are working on Dockerfile - checking AWS ECR repository
const ecr = new AWS.ECR({region: 'eu-west-3'});
const params = { repositoryName: repo };
ecr.listImages(params, function(err, data) {
    if (err) throw new Error(err, err.stack);
    else {
        for (x in data.imageIds) {
            if (data.imageIds[x].imageTag == tag) {
                console.log(`::set-output name=message::tag already exists`)
                throw new Error("tag already exists");
            }
        }
    console.log("tag is new, ok to continue");
    }
});
