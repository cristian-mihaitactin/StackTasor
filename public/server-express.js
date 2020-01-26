var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const fs = require('fs');

var multiparty = require('multiparty');

const router = express.Router();

var authManager = require('./services/managers/authManager');
var projectManager = require('./services/managers/projectManager');
var taskManager = require('./services/managers/taskManager');

port = process.env.PORT || 3000;

var app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : false}));
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

//add multipart/form-data; support
// app.use(bodyParser.raw({ type: 'multipart/form-data' }))

router.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

router.post('/auth', async function(request, response) {
	var form = new multiparty.Form();
 
    form.parse(request, async function(err, fields, files) {
        var username = fields.username;
        var password = fields.password;

        if (username && password) {
            //connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            var results = await authManager.userLogin(username, password);
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                request.session.userId = results[0].id;

                response.status(200).send({
                    RedirectLink: '/home',
                    Error: false
                });
            } else {
                response.status(400).send( {
                    Message: 'Incorrect Username and/or Password!',
                    Error: true
                });
                response.end();
            }
            // });
        } else {
            response.status(401).send( {
                Message: 'Please enter Username and Password!',
                Error: true
            });
            response.end();
        }
    });

	
});

router.get('/home', function(request, response) {
    console.log(path.join(__dirname + '/index.html'));

	if (request.session.loggedin) {
        response.sendFile(path.join(__dirname + '/index.html'));
	} else {
        response.redirect('/');
	}
});

router.get('/signUp', function(request, response) {
    console.log(path.join(__dirname + '/signUp.html'));

	if (!request.session.loggedin) {

        response.sendFile(path.join(__dirname + '/signUp.html'));
        // response.render(path.join(__dirname + '/index.html'));
        // response.send('Welcome back, ' + request.session.username + '!');
        // response.end();

	} else {
        response.status(401).send( {
            Message: 'Please login to view this page!',
            Error: true
        });
        response.end();
	}
});

router.post('/createUser', async function(request, response) {
    var form = new multiparty.Form();
 
    form.parse(request, async function(err, fields, files) {
        var username = fields.username;
        var password = fields.password;
        var repeatPassword = fields.repeatPassword;
        var email = fields.email;
        console.log(username + ', ' + password + ', ' + repeatPassword + ', ' + email );
        if ('' + repeatPassword !== '' + password) {
            console.log('not same password')
            response.status(400).send( {
                Message: 'Please ensure that the Password and Repeat Password are the same',
                Error: true
            });
            response.end();
        } else {
            console.log('same password')
    
            var userExists = await authManager.userExists(username);
            console.log('userExists' + userExists)

            if (userExists){
                response.status(403).send( {
                    Message: 'User name already exists!',
                    Error: true
                });
                response.end();
            } else {
                // create user
                var userCreated = await authManager.userCreate(username, password, email);
                if (userCreated) {
                    console.log('user created: ' + JSON.stringify(userCreated));
                    request.session.loggedin = true;
                    request.session.username = username;
                    request.session.userId = userCreated.id;

                    response.status(200).send({
                        RedirectLink: '/home',
                        Error: false
                    });
                } else {
                    response.status(500).send( {
                        Message: 'Something went wrong when creating user. Please try again.',
                        Error: true
                    });
                    response.end();
                }
            }
        }
    });
});
router.post('/project', async function(request, response) {
    var form = new multiparty.Form();
 
    if (!request.session.loggedin) {
        response.status(401).send( {
            Message: 'Please login to view this page!',
            Error: true
        });
        response.end();
	} else {
        form.parse(request, async function(err, fields, files) {
            var projectName = '' + fields.name;
            var projectColor = '' + fields.color;
            var projectId = '' + files.id;
            var accountId = request.session.userId._;

            var createdProject = await projectManager.createProject(projectId, accountId, projectName, projectColor);

            if (createdProject) {
                response.status(200).send({
                    RedirectLink: '/home',
                    Error: false
                });
            } else {
                response.status(500).send( {
                    Message: 'Something went wrong when creating project. Please try again.',
                    Error: true
                });
                response.end();
            }
        });
    }
});

router.get('/project', async function(request, response) {
    var form = new multiparty.Form();
 
    if (!request.session.loggedin) {
        response.status(401).send( {
            Message: 'Please login to view this page!',
            Error: true
        });
        response.end();
	} else {
        form.parse(request, async function(err, fields, files) {
            var accountId = request.session.userId._;

            var createdProject = await projectManager.getProjectsByUserId(accountId);

            if (createdProject) {
                response.status(200).send(createdProject);
            } else {
                response.status(500).send( {
                    Message: 'Something went wrong when creating project. Please try again.',
                    Error: true
                });
                response.end();
            }
        });
    }
})

router.get('/project/:projectId', async function(request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname + '/project.html'));
	} else {
        response.redirect('/');
	}
});

router.post('/project/:projectId', async function(request, response) {
    var form = new multiparty.Form();
    console.log('Project params: params=' + JSON.stringify(request.params));
    var projectId = request.params.projectId;
 
    if (!request.session.loggedin) {
        response.status(401).send( {
            Message: 'Please login to view this page!',
            Error: true
        });
        response.end();
	} else {
        form.parse(request, async function(err, fields, files) {
            var taskId = '' + files.taskId;
            var taskattachedAccountId = '' + files.attachedAccountId;
            var taskName = '' + fields.name;
            var taskColor = '' + fields.color;
            var taskDescription = '' + fields.description;
            var taskType = '' + fields.taskType;
            var geographicZone = '' + fields.geographicZone;
            var timeZone = '' + fields.timeZone;
            var workDomain = '' + fields.workDomain;
            var estimation = '' + fields.estimation;

            var status = '' + fields.status;
            if (fields.status == undefined ||fields.status == 'undefined' || fields.status == null || fields.status == '') {
                status = 0;
            }

            var createdTask = await taskManager.createTask(taskId, taskattachedAccountId, projectId,
                 taskName, taskColor, taskDescription,
                 taskType, geographicZone,timeZone, workDomain, estimation,status);

            if (createdTask) {
                response.status(200).send({
                    RedirectLink: '/project/'+ projectId,
                    Error: false
                });
            } else {
                response.status(500).send( {
                    Message: 'Something went wrong when creating project. Please try again.',
                    Error: true
                });
                response.end();
            }
        });
    }
});

app.use(express.static(__dirname + '/src'));

app.use('/', router);

app.listen(port);