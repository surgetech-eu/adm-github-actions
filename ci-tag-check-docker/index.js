const AWS = require('aws-sdk')
const fs = require('fs')

// helper func -- parse text file for specified key = 'value'
// returns value without ''
function getValueByKey(text, key){
    var regex = new RegExp("^" + key + " ?=(.*)$", "m")
    var match = regex.exec(text)
    if (match)
        return match[1].replace(/^\s+|\'|\s+$/gm,'')
    else
        return null;
}

// get tag from gradle version
var path = process.env.GITHUB_WORKSPACE + '/build.gradle'
var raw = fs.readFileSync(path, 'utf8')
var tag = getValueByKey(raw, "version")

// get repo name from gradle project name
path = process.env.GITHUB_WORKSPACE + '/settings.gradle'
raw = fs.readFileSync(path, 'utf8')
var repo = getValueByKey(raw, "rootProject.name")

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
