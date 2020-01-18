const TaskRepository = require('../db/taskRepo');
const Task = require('../../models/db/task');

class TaskController {
    constructor(repo){
        if (repo === undefined || repo === null) {
          this._repo = new TaskRepository();
        } else {
          this._repo = repo;
        }
      }

      async get(req, res) {
        await this._repo.get(req.params.projectid, req.params.id).then((value) => {
          res.json(value);
        }).catch((e) =>{
          res.send(e);
        });
      };

      async upsert(req, res) {
        try{
          var obj = req.body;
          var task = new Task(obj.id);
          task.createdDate = obj.createdDate;
          task.updateDate = obj.updateDate;

          task.name = obj.name;
          task.color = obj.color;

          task.projectId = obj.projectId;
          task.accountId = obj.accountId;

          task.decription = obj.decription;
          task.taskType = obj.taskType;
          task.estimation = obj.estimation;
          task.status = obj.status;
          task.geographicZone = obj.geographicZone;
          task.timeZone = obj.timeZone;
          task.workDomain = obj.workDomain;
          task.attachedAccountId = obj.attachedAccountId;
          task.linkToEvidence = obj.linkToEvidence;
          
          await this._repo.upsert(task);
          setTimeout(async () => {
            req.params['id'] = task.id;
            req.params['projectid'] = task.projectId;
            console.log('Task getting with: Id = ' + req.params['id'] + ', ProjectId: ' + req.params['projectid'])
            await this.get(req, res);
              }, 1000);
          res.json();
        } catch (e) {
          console.log('TaskControler error: ' + e);
          res.send(e);
        }
      };

      async remove(req, res) {
        await this._repo.remove(req.params.projectid, req.params.id).then((value) => {
          res.json(value);
        }).catch((e) =>{
          res.send(e);
        });
      };
}

module.exports = TaskController;
