var exec = require('child_process').exec;

var url = process.env.URL || null
if (url === null){
    throw new Error("Problem, there are no webhook address");
}

var username = 'CI'
var emoji = ':ghost:'
var color = '#0C7BDC'
var channel = process.env.CHANNEL || 'monitoring-all'
var subject = process.env.SUBJECT || 'default subject'
var message = process.env.MESSAGE || 'default message'

var payload = `payload='{\"channel\":\"${channel}\",
    \"username\":\"${username}\",
    \"attachments\":[{\"fallback\":\"${subject}\", \"title\":\"${subject}\", \"text\":\"${message}\", \"color\":\"${color}\"}],
    \"icon_emoji\":\"${emoji}\"},'`

var cmd = `curl -sm 5 --data-urlencode ${payload} ${url}`

exec(cmd, function(error, stdout, stderr) {
  if (error) {
    console.log("Error: ",error.code, stderr);
  }
});
