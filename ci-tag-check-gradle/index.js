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
var path = process.env.WORKSPACE + '/build.gradle'
var raw = fs.readFileSync(path, 'utf8')
var tag = getValueByKey(raw, "version")

// get a part of path inside maven repo from gradle group
var group_dots = getValueByKey(raw, "group")
var group_slashes = group_dots.replace(/\./gm,'\/')

// get repo name from gradle project name
path = process.env.WORKSPACE + '/settings.gradle'
raw = fs.readFileSync(path, 'utf8')
var name = getValueByKey(raw, "rootProject.name")

// set github workflow output
var branch = process.env.GITHUB_REF
console.log(`::set-output name=tag::${tag}`)
console.log(`::set-output name=repo::${name}`)
console.log(`::set-output name=branch::${branch}`)

// we are working on java library - checking S3 bucket
const s3 = new AWS.S3();
const Bucket = "surge-dev-packages";
const Prefix = "java/release/" + group_slashes + "/" + name + "/" + tag;
const MaxKeys = 1; // if a single object is found, the folder exists.
const params = { Bucket, Prefix, MaxKeys };

s3.listObjectsV2(params, (err, data) => {
    const folderExists = data.Contents.length > 0;
    if (folderExists == true) {
        console.log(`::set-output name=message::tag already exists`)
        throw new Error("tag already exists");
    } else {
        console.log("tag is new, ok to continue");
    }
});
