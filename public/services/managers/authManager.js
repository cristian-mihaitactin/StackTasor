const restapi_users = require('../rest-services/restApi-user');

exports.userLogin = async (username, password) => {
    var usr = '';
    await restapi_users.getUserLogin(username, password).then((value) => {
        if (value === undefined || value === null){
            throw Error('No user found. Username: ' + username);
        }else {
            usr = value;
        }
    })
    return usr;
}

exports.userExists = async (username) => {
    var exists = false;
    await restapi_users.userExists(username).then((value) => {
        if (value === undefined || value === null){
            exists = false;
        }else {
            if (value.length > 0){
                exists =  true;
            }else {
                exists =  false;
            }
        }
    })
    return exists;
}

exports.userCreate = async (username, password, email) => {
    var usr = '';
    await restapi_users.upsertUser(username, password, email).then((value) => {
        if (value === undefined || value === null){
            throw Error('User could not be created. Username: ' + username);
        }else {
            usr = value;
        }
    })
    return usr;
}