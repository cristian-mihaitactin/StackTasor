var express = require('express'),
  app = express(),
  port = process.env.SPORT || 3000;

const https = require('https');
https.globalAgent.options.ca = require('ssl-root-cas/latest').create();
const fs = require('fs');

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./routes'); //importing route
routes(app); //register the route


// app.listen(port);


const options = {
  // pfx: fs.readFileSync('./certs/local/localcert.pfx'),
  // passphrase: '12345'
};

// https.createServer(options, (req, res) => {
//   res.writeHead(200);
//   res.end('hello world\n');
// }, app).listen(port);

https.createServer(options, app).listen(port);

// Health port
var http = require('http');

//create a server object:
http.createServer(function (req, res) {
  res.write('Hello World!'); //write a response to the client
  res.end(); //end the respon
}).listen(8080); //the server object listens on port 8080
/////////////////////////////////////////////////////////////////
console.log('todo list RESTful API server started on: ' + port);