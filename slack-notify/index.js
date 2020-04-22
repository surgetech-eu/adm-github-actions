var exec = require('child_process').exec;

var url = process.env.URL || null
if (url === null){
    throw new Error("Problem, there are no webhook address");
}

var username = 'CI'
var emoji = ':ghost:'
var channel = process.env.CHANNEL || 'dev-ci'
var status  = process.env.STATUS  || 'Unknown'
var subject = process.env.SUBJECT || 'Something wrong'
var message = process.env.MESSAGE || ''

switch (status) {
    case 'Started':
        var color = '#546E7A'
        break
    case 'Failed':
        var color = '#F44336'
        break
    case 'Success':
        var color = '#4CAF50'
        break
    default:
        var color = '#E0E0E0'
        break
}

if (message == '') {
    var text = 'Status: ' + status
}
else {
    var text = 'Status: ' + status + '\nMessage: ' + message
}

console.log("********************", subject, "***", text, "***", color)

var payload = `payload='{\"channel\":\"${channel}\",
    \"username\":\"${username}\",
    \"attachments\":[{\"fallback\":\"${subject}\", \"title\":\"${subject}\", \"text\":\"${text}\", \"color\":\"${color}\"}],
    \"icon_emoji\":\"${emoji}\"},'`

var cmd = `curl -sm 5 --data-urlencode ${payload} ${url}`

exec(cmd, function(error, stdout, stderr) {
  console.log("Out: ", stdout, "Error:", stderr);
  if (error) {
    console.log("Error: ",error.code, stderr);
  }
});
