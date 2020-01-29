var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const fs = require('fs');
var webPush = require('web-push');
var pushSubscription = {"endpoint":"https://android.googleapis.com/gcm/send/f1LsxkKphfQ:APA91bFUx7ja4BK4JVrNgVjpg1cs9lGSGI6IMNL4mQ3Xe6mDGxvt_C_gItKYJI9CAx5i_Ss6cmDxdWZoLyhS2RJhkcv7LeE6hkiOsK6oBzbyifvKCdUYU7ADIRBiYNxIVpLIYeZ8kq_A",
"keys":{"p256dh":"BLc4xRzKlKORKWlbdgFaBrrPK3ydWAHo4M0gs0i1oEKgPpWC5cW8OCzVrOQRv-1npXRWk8udnW3oYhIO4475rds=", "auth":"5I2Bu2oKdyy9CwL8QVF0NQ=="}};

var multiparty = require('multiparty');

const router = express.Router();

var authManager = require('./services/managers/authManager');
var projectManager = require('./services/managers/projectManager');
var taskManager = require('./services/managers/taskManager');

port = process.env.PORT || 3000;
const mainUrl = process.env.HOSTNAME;
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
    console.log("router.get('/'");
	 response.sendFile(path.join(__dirname + "/views" + '/login.html'));
     //response.send(mainUrl + '/static/login.html');
});

router.post('/signout', async function(request, response) {
    console.log("router.post('/signout'");

    if (request.session.loggedin) {
        request.session.loggedin = false;
        request.session.username = "";
        request.session.userId = "";
        response.redirect('/');
	} else {
        request.session.fromRedirect = true;
        request.session.fromRedirectUrl = '/home';
        response.redirect('/');
	}
});

router.post('/auth', async function(request, response) {
    console.log("router.post('/auth'");

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

                var _redirectLink = '/home';
                if (request.session.fromRedirect) {
                    _redirectLink = request.session.fromRedirectUrl;
                    request.session.fromRedirect = false;
                }
                response.status(200).send({
                    RedirectLink: _redirectLink,
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
    console.log("router.get('/home'");

	if (request.session.loggedin) {
        response.sendFile(path.join(__dirname + "/views" + '/index.html'));
        //  response.send(mainUrl + '/static/index.html');
        // response.redirect(mainUrl + '/static/index.html');

	} else {
        request.session.fromRedirect = true;
        request.session.fromRedirectUrl = '/home';
        response.redirect('/');
	}
});

router.get('/signUp', function(request, response) {
    console.log("router.get('/signUp'");

	if (!request.session.loggedin) {

        response.sendFile(path.join(__dirname + "/views" + '/signUp.html'));
        // response.send( '/signUp.html');
	} else {
        response.status(401).send( {
            Message: 'Please login to view this page!',
            Error: true
        });
        response.end();
	}
});

router.post('/createUser', async function(request, response) {
    console.log("router.post('/createUser'");

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
        response.sendFile(path.join(__dirname + "/views" + '/project.html'));
        // response.send('/project.html');
	} else {
        request.session.fromRedirect = true;
        request.session.fromRedirectUrl = '/project/' + request.params.projectId;
        response.redirect('/');
	}
});

router.get('/project/:projectId/tasks', async function(request, response) {
    var projectId = request.params.projectId;

    if (request.session.loggedin) {
        var loggedUserId =  request.session.userId._;
        var createdtasks = await taskManager.getTasksByProjectId(loggedUserId,projectId);

        if (createdtasks) {
            response.status(200).send(createdtasks);
        } else {
            response.status(500).send( {
                Message: 'Something went wrong when creating project. Please try again.',
                Error: true
            });
            response.end();
        }
	} else {
        request.session.fromRedirect = true;
        request.session.fromRedirect = '/tasks/' + request.params.taskId;
        response.redirect('/');
	}
});

router.post('/project/:projectId', async function(request, response) {
    var form = new multiparty.Form();
    var projectId = request.params.projectId;
    if (!request.session.loggedin) {
        response.status(401).send( {
            Message: 'Please login to view this page!',
            Error: true
        });
        response.end();
	} else {
        form.parse(request, async function(err, fields, files)
         {
            console.log("post('/project/:projectId'=" + JSON.stringify(fields));
            console.log("post('/project/:projectId'.id=" + JSON.stringify(fields.taskId));

            var taskId = '' + fields.taskId;
            var taskattachedAccountId = '' + files.attachedAccountId;
            var taskName = '' + fields.name;
            var taskColor = '' + fields.color;
            var taskDescription = '' + fields.description;
            var taskType = '' + fields.taskType;
            var geographicZone = '' + fields.geographicZone;
            var timeZone = '' + fields.timeZone;
            var workDomain = '' + fields.workDomain;
            var estimation = '' + fields.estimation;
            var evidence = '' + fields.evidence;

            var status = '' + fields.status;
            if (fields.status == undefined ||fields.status == 'undefined' || fields.status == null || fields.status == '') {
                status = 0;
            }

            var createdTask = await taskManager.createTask(taskId, taskattachedAccountId, projectId,
                 taskName, taskColor, taskDescription,
                 taskType, geographicZone,timeZone, workDomain, estimation,status, evidence);

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

router.get('/project/:projectId/tasks/:taskId', async function(request, response) {
    var projectId = request.params.projectId;
    var taskId = request.params.taskId;

    if (request.session.loggedin) {

        var createdtasks = await taskManager.getTasksById(projectId, taskId);
        if (createdtasks) {
            response.status(200).send(createdtasks);
        } else {
            response.status(500).send( {
                Message: 'Something went wrong when creating project. Please try again.',
                Error: true
            });
            response.end();
        }
	} else {
        request.session.fromRedirect = true;
        request.session.fromRedirect = '/project/' + projectId + '/tasks/' + request.params.taskId;
        response.redirect('/');
	}
});

router.get('/workItem/:projectId/tasks/:taskId', async function(request, response) {
    var projectId = request.params.projectId;
    var taskId = request.params.taskId;

    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname + "/views" + '/workItem.html'));
       // response.send('/workItem.html');
	} else {
        request.session.fromRedirect = true;
        request.session.fromRedirectUrl = '/workItem/' + projectId + '/tasks/' + taskId;
        response.redirect('/');
	}
});

router.post('/workItem/:projectId/tasks/:taskId', async function(request, response) {
    var projectId = request.params.projectId;
    var taskId = request.params.taskId;

    var redirectLink = '/workItem/' + projectId + '/tasks/' + taskId;
    if (request.session.loggedin) {
        var newStatus = 0;
        var taskattachedAccountId = request.session.userId;
        var evidence = '';

        var statusChange = request.body;
        if ('{}' == JSON.stringify(request.body)){
            statusChange.Finished = true;

            statusChange.Accepted = false;
            statusChange.Abandon = false;
        }
        if (statusChange.Accepted) {
            newStatus = 1;
            await updateTask(response,taskId,
                taskattachedAccountId, projectId,
                newStatus, evidence)
        }else {
            var taskBefore = await taskManager.getTasksById(projectId, taskId);
            if (taskattachedAccountId._ == taskBefore.attachedAccountId){
                if (statusChange.Abandon) {
                    newStatus = 0;
                    taskattachedAccountId = null;
                    await updateTask(response,taskId,
                        taskattachedAccountId, projectId,
                        newStatus, evidence)
                } else if (statusChange.Finished) {
                    newStatus = 2;
                    var form = new multiparty.Form();
                    form.parse(request, async function(err, fields, files) {
                        evidence = "" + fields.evidence;
                        await updateTask(response,taskId,
                            taskattachedAccountId, projectId,
                            newStatus, evidence)
                    });
                }
            } else {
                response.status(403).send( {
                    Message: "You can't modify a task that you are not attached to!",
                    Error: true
                });
                response.end();
                return;
            }
        }
        console.log('evidence.after=' + evidence);
	} else {
        request.session.fromRedirect = true;
        request.session.fromRedirectUrl = redirectLink;
        response.redirect('/');
	}
});
async function updateTask(response,taskId,
    taskattachedAccountId, projectId,
    newStatus, evidence) {
    var redirectLink = '/workItem/' + projectId + '/tasks/' + taskId;

    var updatedTasks = await taskManager.updateTaskStatus(taskId,
        taskattachedAccountId, projectId,
        newStatus, evidence);
   if (updatedTasks) {
   response.status(200).send({
       RedirectLink: redirectLink,
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
router.delete('/project/:projectId/tasks/:taskId', async function(request, response) {
    var projectId = request.params.projectId;
    var taskId = request.params.taskId;

    var redirectLink = '/project/' + projectId;
    if (request.session.loggedin) {
        var loggedUser = request.session.userId._;
        await taskManager.deleteTask(taskId, projectId, loggedUser);
        response.status(200).send({
            RedirectLink: redirectLink,
            Error: false
        });
	} else {
        request.session.fromRedirect = true;
        request.session.fromRedirectUrl = redirectLink;
        response.redirect('/');
	}
});
app.use(express.static(__dirname + '/src'));
app.use('/static', express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/pwa'));

app.use('/', router);

app.listen(port);