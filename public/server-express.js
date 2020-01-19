var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const fs = require('fs');
const router = express.Router();

var authManager = require('./services/managers/authManager');

port = process.env.PORT || 3000;

var app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

router.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

router.post('/auth', async function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		//connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
        var results = await authManager.userLogin(username, password);
        if (results.length > 0) {
            request.session.loggedin = true;
            request.session.username = username;
            response.redirect('/home');
        } else {
            response.send('Incorrect Username and/or Password!');
            response.end();
        }
		// });
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

router.get('/home', function(request, response) {
    console.log(path.join(__dirname + '/index.html'));

	if (request.session.loggedin) {
        console.log('sending file?');

        response.sendFile(path.join(__dirname + '/index.html'));
        // response.render(path.join(__dirname + '/index.html'));
        console.log('send file?');
        // response.send('Welcome back, ' + request.session.username + '!');
        // response.end();

	} else {
        response.send('Please login to view this page!');
        response.end();
	}
});

app.use(express.static(__dirname + '/src'));
// app.use(express.static(__dirname + '/src/images'));
// app.use(express.static(__dirname + '/src/js'));

app.use('/', router);

app.listen(port);