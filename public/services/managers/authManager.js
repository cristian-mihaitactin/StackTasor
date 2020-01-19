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
