const config = require(process.env.WORKSPACE + '/package.json')

// get short branch name
var branch = process.env.GITHUB_REF.replace(/refs\/heads\//gm,'')

// set github workflow output
console.log(`::set-output name=tag::${config.version}`)
console.log(`::set-output name=repo::${config.name}`)
console.log(`::set-output name=branch::${branch}`)
