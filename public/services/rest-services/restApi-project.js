const https_serivce = require('./http-service');

const rest_api_users_path = '/users';
const rest_api_projects_path = '/projects';

exports.getProjectByIds = async (projectId, userId) => {
    var projectsPath = rest_api_users_path + '/' + userId + rest_api_projects_path + '/' + projectId;
    var returnValue = '';
    await https_serivce.restapi_get(projectsPath).then((value) => {
        returnValue =  value;
    }).catch(
        (reason) => {
             console.log('RestApi-Project.Get rejected promise ('+reason+') here.');
             throw new Error(reason);
         }
    );

    return returnValue;
}

exports.getProjectByUserId = async (userId) => {
    var projectsPath = rest_api_users_path + '/' + userId + rest_api_projects_path;
    var returnValue = '';
    await https_serivce.restapi_get(projectsPath).then((value) => {
        returnValue =  value;
    }).catch(
        (reason) => {
             console.log('RestApi-Project.Get rejected promise ('+reason+') here.');
             throw new Error(reason);
         }
    );

    return returnValue;
}

exports.upsertProject = async (projectObj, userId) => {
    console.log('exports.upsertProject: projectObj= ' + JSON.stringify(projectObj));
    console.log('exports.upsertProject: userId= ' + userId);
    var projectsPath = rest_api_users_path + '/' + userId + rest_api_projects_path;
    var returnValue = '';
    await https_serivce.restapi_post(projectsPath, projectObj).then((value) => {
        console.log('exports.upsertProject[Created]: projectObj= ' + JSON.stringify(value));

        returnValue =  value;
    }).catch(
        (reason) => {
             console.log('RestApi-Project.Upsert rejected promise ('+reason+') here.');
             throw new Error(reason);
         }
    );

    return returnValue;
}

exports.deleteProjectUserById = async (projectId, userId) => {
    var projectsPath = rest_api_users_path + '/' + userId + rest_api_projects_path + '/' + projectId;
    var returnValue = '';
    await https_serivce.restapi_delete(projectsPath).then((value) => {
        returnValue =  value;
    }).catch(
        (reason) => {
             console.log('RestApi-Project.Delete rejected promise ('+reason+') here.');
             throw new Error(reason);
         }
    );

    return returnValue;
}