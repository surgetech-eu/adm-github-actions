const config = require(process.env.GITHUB_WORKSPACE + '/package.json')
const exec = require('child_process').exec;

// get short branch name
var branch = process.env.GITHUB_REF.replace(/refs\/heads\//gm,'')

// set github workflow output
console.log(`::set-output name=tag::${config.version}`)
console.log(`::set-output name=repo::${config.name}`)
console.log(`::set-output name=branch::${branch}`)

// check tag
var cmd = `npm view ${config.name} versions --json`
exec(cmd, function(error, stdout, stderr) {
    if (error) {
        console.log(`::set-output name=message::internal error in tag checker`)
        throw new Error(error.code, stderr);
    }

    let tags = JSON.parse(stdout);
    for (let tag of tags){
        if (tag == ${config.version}) {
            console.log(`::set-output name=message::tag already exists`)
            throw new Error("tag already exists");
        }
    }
    console.log("tag is new, ok to continue");
});
