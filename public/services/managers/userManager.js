const Statistic = require('../../entities/statistics')
const restapi_users = require('../rest-services/restApi-user');

exports.getUserStats = async (accountId) => {
    var statsObj = new Statistic(accountId);

    await restapi_users.getUserStats(accountId).then((value) => {
        if (value === undefined || value === null){
            throw Error('No project found. ProjectId= ' + statsObj.id);
        }else {
            //result = value;
            statsObj.taskCreatedList = value.taskCreatedList;
            statsObj.tasksDoneList = value.tasksDoneList;
        }
    })
    return statsObj;
}

exports.userGetSubscription = async (userId) => {
    var usr = '';
    await restapi_users.getSubscription(userId).then((value) => {
        if (value === undefined || value === null){
            throw Error('Could not get sub. userId: ' + userId);
        }else {
            usr = value.endpoint;
        }
    })
    return usr;
}

exports.userPostSubscription = async (userId, sub) => {
    var usr = '';
    await restapi_users.postSubscription(userId, sub).then((value) => {
        if (value === undefined || value === null){
            throw Error('Could not get sub. userId: ' + userId);
        }else {
            usr = value.endpoint;
        }
    })
    return usr;
}