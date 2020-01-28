const restapi_tasks = require('../rest-services/restApi-task');
const Task = require('../../entities/task')

exports.getTasksById = async (projectId, taskId) => {
    var objList = '';
    await restapi_tasks.getTaskById(projectId, taskId).then((value) => {
        if (value === undefined || value === null){
            throw Error('No tasts found. TaskId: ' + taskId);
        }else {
            objList = value;
        }
    })
    return objList;
}

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

exports.getTasksByProjectId = async (loggedUserId,projectId) => {
    var objList = '';
    await restapi_tasks.getTaskByProjectId(loggedUserId,projectId).then((value) => {
        if (value === undefined || value === null){
            throw Error('No tasts found. Project: ' + projectId);
        }else {
            objList = value;
        }
    })
    return objList;
}

exports.updateTaskStatus = async (taskId, taskattachedAccountId, projectId,
    status, evidence) => {
   var taskObj = new Task(taskId);
   taskObj.attachedAccountId = taskattachedAccountId;
   taskObj.projectId = projectId;

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

exports.deleteTask = async (taskId, projectId, userId) => {
    var result = '';
   await restapi_tasks.deleteTaskProjectUserById(taskId, projectId, userId).then((value) => {
           result = value;
   });

   return result;
}