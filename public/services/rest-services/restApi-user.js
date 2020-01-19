const https_serivce = require('./http-service');
const User = require('../../../models/db/user');

const rest_api_users_path = '/users';

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

exports.upsertUser = async (userObj) => {
    var usersPath = rest_api_users_path;
    var returnValue = '';
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