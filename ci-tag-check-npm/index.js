const config = require(process.env.WORKSPACE + '/package.json')

// Setting github workflow output
console.log(`::set-output name=tag::${config.version}`)
