const restapi_tasks = require('../rest-services/restApi-task');
const Task = require('../../../models/db/task')

exports.createTask = async (taskId, taskattachedAccountId, projectId,
     name, color, description, taskType,
      geographicZone,timeZone, workDomain, estimation,status, evidence) => {
    var taskObj = new Task(taskId);
    taskObj.attachedAccountId = taskattachedAccountId;
    taskObj.projectId = projectId;
    taskObj.name = name;
    taskObj.color = color;
    taskObj.description = description;
    taskObj.taskType = taskType;
    taskObj.geographicZone = geographicZone;
    taskObj.timeZone = timeZone;
    taskObj.workDomain = workDomain;

    taskObj.estimation = estimation;
    taskObj.status = status;
    taskObj.evidence = evidence;


    var result = '';
    await restapi_tasks.upsertTask(taskObj, projectId).then((value) => {
        if (value === undefined || value === null){
            throw Error('No task found. TaskId= ' + taskObj.id);
        }else {
            result = value;
        }
    })
    return result;
}

exports.getTasksByProjectId = async (projectId) => {
    var objList = '';
    await restapi_tasks.getTaskByProjectId(projectId).then((value) => {
        if (value === undefined || value === null){
            throw Error('No tasts found. Project: ' + projectId);
        }else {
            objList = value;
        }
    })
    return objList;
}