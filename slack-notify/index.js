var exec = require('child_process').exec;

var url = process.env.URL || null
if (url === null){
    throw new Error("Problem, there are no webhook address");
}

var username = 'CI'
var emoji = ':ghost:'
var channel = process.env.CHANNEL || 'dev-ci'
var status  = process.env.STATUS  || 'unknown'
var subject = process.env.SUBJECT || 'something wrong'
var message = process.env.MESSAGE || ''

switch (status) {
    case 'started':
        var color = '#546E7A'
        break
    case 'failure':
        var color = '#F44336'
        break
    case 'success':
        var color = '#4CAF50'
        break
    default:
        var color = '#E0E0E0'
        break
}

if (message == '') {
    var text = 'status: ' + status
}
else {
    var text = 'status: ' + status + '\n' + message
}

var payload = `payload='{\"channel\":\"${channel}\",
    \"username\":\"${username}\",
    \"attachments\":[{\"fallback\":\"${subject}\", \"title\":\"${subject}\", \"text\":\"${text}\", \"color\":\"${color}\"}],
    \"icon_emoji\":\"${emoji}\"},'`

var cmd = `curl -sm 5 --data-urlencode ${payload} ${url}`

exec(cmd, function(error, stdout, stderr) {
  console.log("Slack reply: ", stdout);
  if (error) {
    console.log("Error: ", error.code, stderr);
  }
});
