const restapi_projects = require('../rest-services/restApi-project');
const Project = require('../../../models/db/project')

exports.createProject = async (projectId, accountId, name, color) => {
    var projectObj = new Project(projectId);
    projectObj.accountId = accountId;
    projectObj.name = name;
    projectObj.color = color;

    var result = '';
    await restapi_projects.upsertProject(projectObj, projectObj.accountId).then((value) => {
        if (value === undefined || value === null){
            throw Error('No project found. ProjectId= ' + projectObj.id);
        }else {
            result = value;
        }
    })
    return result;
}

exports.getProjectsByUserId = async (accountId) => {
    var usr = '';
    await restapi_projects.getProjectByUserId(accountId).then((value) => {
        if (value === undefined || value === null){
            throw Error('No projects found. AccountId: ' + accountId);
        }else {
            usr = value;
        }
    })
    return usr;
}