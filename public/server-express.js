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
var userManager = require('./services/managers/userManager');
var FrontStatistics = require('./entities/front-statistics');
const webpush = require('web-push');
const gcmAPIKey_Server = "AAAAe5XNnaI:APA91bFznn0-NJSeQ-LyyoLBkMGEbg2srDeYVy12xeu-iMoHbit4ePbkiusJ5rAJd2JGlhglEb9tlsVtwIWp7YfKyY1JLjHkdBbE5EAvVoSjurjqGZItsneCPYp3G1w1aBJTXsXxyTKz"


webpush.setGCMAPIKey(gcmAPIKey_Server);

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
//SET VAPID
const vapidKeys = !process.env.VAPID_PUBLIC || !process.env.VAPID_PRIVATE ?
    webpush.generateVAPIDKeys() : 
    {
        publicKey : process.env.VAPID_PUBLIC,
        privateKey : process.env.VAPID_PRIVATE
    }
router.get('/subscription', function(request, response) {
    console.log("router.get('/subscription'");
    response.status(200).send(vapidKeys.publicKey);
    response.end();
     //response.send(mainUrl + '/static/login.html');
});

console.log("Vapid: " + JSON.stringify(vapidKeys));

router.post('/subscription', function(request, response) {
    console.log("router.post++('/subscription'");


	if (request.session.loggedin) {
        var subscription = request.body;

        // subscription.endpoint
        //Update Endpoint
        console.log("router.post++('/subscription.endpoint: ",subscription );
        var subUrl = userManager.userPostSubscription(request.session.userId._, subscription);
        response.status(200).send(subUrl);

	} else {
        response.status(401).send( {
            Message: 'Please LogIn!',
            Error: true
        });
    }
    response.end();
});

router.get('/', function(request, response) {
    console.log("router.get('/'");
	 response.sendFile(path.join(__dirname + "/views" + '/login.html'));
     //response.send(mainUrl + '/static/login.html');
});

// router.post('/signout', async function(request, response) {
router.get('/signout', async function(request, response) {

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
            var userId = '' + request.session.userId._;
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
            var expiryDate = '' + fields.expiryDate;

            var status = '' + fields.status;
            if (fields.status == undefined ||fields.status == 'undefined' || fields.status == null || fields.status == '') {
                status = 0;
            }

            var createdTask = await taskManager.createTask(taskId, userId, taskattachedAccountId, projectId,
                 taskName, taskColor, taskDescription,
                 taskType, geographicZone,timeZone, workDomain, estimation,status, evidence, expiryDate);

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

    // if (request.session.loggedin) {

    //     var createdtasks = await taskManager.getTasksById(projectId, taskId);
    //     if (createdtasks) {
    //         response.status(200).send(createdtasks);
    //     } else {
    //         response.status(500).send( {
    //             Message: 'Something went wrong when creating project. Please try again.',
    //             Error: true
    //         });
    //         response.end();
    //     }
	// } else {
    //     request.session.fromRedirect = true;
    //     request.session.fromRedirect = '/project/' + projectId + '/tasks/' + request.params.taskId;
    //     response.redirect('/');
    // }
    
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
});

router.get('/workItem/:projectId/tasks/:taskId', async function(request, response) {
    var projectId = request.params.projectId;
    var taskId = request.params.taskId;
    response.sendFile(path.join(__dirname + "/views" + '/workItem.html'));
    // if (request.session.loggedin) {
        
    //    // response.send('/workItem.html');
	// } else {
    //     request.session.fromRedirect = true;
    //     request.session.fromRedirectUrl = '/workItem/' + projectId + '/tasks/' + taskId;
    //     response.redirect('/');
	// }
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
        // response.redirect('/');
        response.send({
            RedirectLink: '/',
            Error: false
        })
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
    //send notif
    // sendNotification(userId,notifBody)
    var statusString = "ToDo";
    if (updatedTasks.status == 1) {
        statusString = "InProgress";
    }else if (updatedTasks.status == 2) {
        statusString = "Done";
    }else if (updatedTasks.status > 2) {
        statusString = "Expired";
    }

    var notifMessage = `Task Status Update! ${updatedTasks.name} updated to ${statusString}`;
    sendNotification(updatedTasks.userId,notifMessage);

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
        // response.redirect('/');
        response.send({
            RedirectLink: '/',
            Error: false
        });
	}
});

router.get('/statistics', async function(request, response) {

    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname + "/views" + '/statistics.html'));
        // response.send('/project.html');
	} else {
        request.session.fromRedirect = true;
        request.session.fromRedirectUrl = '/statistics';
        response.redirect('/');
	}
});

router.get('/stats', async function(request, response) {

    if (request.session.loggedin) {
        var loggedUserId =  request.session.userId._;
        var stats = await userManager.getUserStats(loggedUserId);
        
        if (stats) {
            var frontStats =new FrontStatistics(stats)
            // console.log('STATS: ' + JSON.stringify(stats));
            // stats.forEach((val) => {
            //     statsLists.push(new FrontStatistics(val));
            // });

            response.status(200).send(frontStats);
        } else {
            response.status(500).send( {
                Message: 'Something went wrong when creating project. Please try again.',
                Error: true
            });
            response.end();
        }
	} else {
        request.session.fromRedirect = true;
        request.session.fromRedirect = '/statistics';
        response.redirect('/');
	}
});

function sendNotification(userId,notifBody) {
    //Get Subs
    userManager.userGetSubscription(userId).then((subObj) => {
        console.log('[sendNotification].subObj: ', subObj);

        var pushSubscription = {"endpoint": subObj.endpoint,
            "keys":{
                "p256dh":subObj.p256dh, 
                "auth":subObj.auth
            }
        };

        var payload = notifBody;

        var options = {
            vapidDetails: {
                subject: 'mailto:example_email@example.com',
                publicKey: vapidKeys.publicKey,
                privateKey: vapidKeys.privateKey
              },
            TTL: 600
        };

        console.log('[sendNotification]: pushSubscription', pushSubscription);
        console.log('[sendNotification]:options ', options);
        webpush.sendNotification(
            pushSubscription,
            payload,
            options
        ).catch((ex) => {
            console.log('[sendNotification]There was an error: ', ex);
        });
    }).catch((ex) => {
        console.log('There was an error: ', ex);
    });
}

app.use(express.static(__dirname + '/src'));
app.use('/static', express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/pwa'));

app.use('/', router);

app.listen(port);