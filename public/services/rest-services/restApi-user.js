const https_serivce = require('./http-service');
const User = require('../../entities/user');

const rest_api_users_path = '/users';
const rest_api_users_stats_path = '/stats';
const rest_api_users_subs_path = '/subscription';

exports.getUserById = async (userId) => {
    var usersPath = rest_api_users_path + '/' + userId;
    var returnValue = '';
    await https_serivce.restapi_get(usersPath).then((value) => {
        returnValue =  value;
    }).catch(
        (reason) => {
             console.log('RestApi-User.Get rejected promise ('+reason+') here.');
             throw new Error(reason);
         }
    );

    return returnValue;
}

exports.getUserStats = async (userId) => {
    var usersPath = rest_api_users_stats_path + '/' + userId;
    var returnValue = '';
    await https_serivce.restapi_get(usersPath).then((value) => {
        returnValue =  value;
    }).catch(
        (reason) => {
             console.log('RestApi-User-Stats.Get rejected promise ('+reason+') here.');
             throw new Error(reason);
         }
    );

    return returnValue;
}

exports.upsertUser = async (username, password, email) => {
    var usersPath = rest_api_users_path;
    var returnValue = '';
    
    var userObj = new User();
    userObj.username = '' + username;
    userObj.password = '' + password;
    userObj.email = '' + email;
    userObj.accountType = '' + 1;

    await https_serivce.restapi_post(usersPath, userObj).then((value) => {
        returnValue =  value;
    }).catch(
        (reason) => {
             console.log('RestApi-User.Upsert rejected promise ('+reason+') here.');
             throw new Error(reason);
         }
    );

    return returnValue;
}

exports.deleteUserById = async (userId) => {
    var usersPath = rest_api_users_path + '/' + userId;
    var returnValue = '';
    await https_serivce.restapi_delete(usersPath).then((value) => {
        returnValue =  value;
    }).catch(
        (reason) => {
             console.log('RestApi-User.Delete rejected promise ('+reason+') here.');
             throw new Error(reason);
         }
    );

    return returnValue;
}

exports.getUserLogin = async (username, password) => {
    var usersPath = rest_api_users_path;
    var returnValue = '';
    var loginUser = new User();
    loginUser.id = '';
    loginUser.username = username;
    loginUser.password = password;

    await https_serivce.restapi_query(usersPath, loginUser).then((value) => {
        returnValue =  value;
    }).catch(
        (reason) => {
             console.log('RestApi-User.GetQuery rejected promise ('+reason+') here.');
             throw new Error(reason);
         }
    );
    return returnValue;
}

exports.userExists = async (username) => {
    var usersPath = rest_api_users_path;
    var returnValue = '';
    var loginUser = new User();
    loginUser.id = '';
    loginUser.username = username;

    await https_serivce.restapi_query(usersPath, loginUser).then((value) => {
        returnValue =  value;
    }).catch(
        (reason) => {
             console.log('RestApi-User.GetQuery rejected promise ('+reason+') here.');
             throw new Error(reason);
         }
    );
    return returnValue;
}

exports.getSubscription = async (userId) => {
    var usersPath = rest_api_users_subs_path + '/' + userId;
    var returnValue = '';
    console.log('exports.getSubscription URL', usersPath);

    await https_serivce.restapi_get(usersPath).then((value) => {
        console.log('exports.getSubscription', value);
        returnValue =  value;
    }).catch(
        (reason) => {
             console.log('RestApi-User.GetSub rejected promise ('+reason+') here.');
             throw new Error(reason);
         }
    );
    return returnValue;
}

exports.postSubscription = async (userId, sub) => {
    var usersPath = rest_api_users_subs_path;
    var body = sub;
    body.userId = userId;
    var returnValue = '';

    await https_serivce.restapi_post(usersPath, body).then((value) => {
        returnValue =  value;
    }).catch(
        (reason) => {
             console.log('RestApi-User.PostSub rejected promise ('+reason+') here.');
             throw new Error(reason);
         }
    );
    return returnValue;
}