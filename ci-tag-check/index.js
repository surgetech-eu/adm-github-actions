
const config = require(process.env.WORKSPACE + '/surge-ci.json')
console.log(`::set-output name=tag::${config.tag}`)

/*
exec(cmd, function(error, stdout, stderr) {
  if (error) {
    console.log("Error: ",error.code, stderr);
  }
});
*/