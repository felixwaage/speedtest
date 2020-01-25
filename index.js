var speedTest = require('speedtest-net');
var fs = require('fs');
var express = require('express');
var app = express();

console.log("Interval: " + process.argv[2]);
console.log("Start time: " + timeConverter(Date.now()));

var intervall = process.argv[2];

setInterval(runSpeedTest, intervall);

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

function runSpeedTest(){
    var test;

    test = speedTest({maxTime: 5000});

    test.on('data', speedTestresult => {
        console.log("Host: " + speedTestresult.server.host + "\tdownload: " + speedTestresult.speeds.download  + " Mbps" + "\tupload: " + speedTestresult.speeds.upload + " Mbps");
        
        speedTestresult.timestamp = timeConverter(Date.now());

        fs.readFile('result.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
            obj = JSON.parse(data); //now it an object
            obj.result.push(speedTestresult); //add some data
            json = JSON.stringify(obj); //convert it back to json
            fs.writeFile('result.json', json, 'utf8', (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
              }); // write it back 
        }});
    })
}


app.get('/speedtest', function (req, res) {
    fs.readFile('result.json','utf8', function readFileCallback(err, data){
        if(err) console.log(err);
        else {
            res.send(data);
        }
    })
});
  
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});