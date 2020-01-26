const https_serivce = require('./http-service');

const rest_api_users_path = '/users';
const rest_api_projects_path = '/projects';
const rest_api_tasks_path = '/tasks';


exports.getTaskByProjectId = async (projectId) => {
    var tasksPath = rest_api_projects_path + '/' + projectId + rest_api_tasks_path;
    var returnValue = '';
    await https_serivce.restapi_get(tasksPath).then((value) => {
        returnValue =  value;
    }).catch(
        (reason) => {
             console.log('RestApi-Task.Get rejected promise ('+reason+') here.');
             throw new Error(reason);
         }
    );

    return returnValue;
}

exports.upsertTask = async (taskObj, projectId) => {
    var tasksPath = rest_api_projects_path + '/' + projectId + rest_api_tasks_path;
    var returnValue = '';
    await https_serivce.restapi_post(tasksPath, taskObj).then((value) => {
        returnValue =  value;
    }).catch(
        (reason) => {
             console.log('RestApi-Task.Upsert rejected promise ('+reason+') here.');
             throw new Error(reason);
         }
    );

    return returnValue;
}

exports.deleteTaskProjectUserById = async (taskId, projectId, userId) => {
    var tasksPath = rest_api_projects_path + '/' + projectId + rest_api_tasks_path + '/' + taskId;
    var returnValue = '';
    await https_serivce.restapi_delete(tasksPath).then((value) => {
        returnValue =  value;
    }).catch(
        (reason) => {
             console.log('RestApi-Task.Delete rejected promise ('+reason+') here.');
             throw new Error(reason);
         }
    );

    return returnValue;
}