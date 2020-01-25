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

      async getByProjectId(req, res) {
        var queryObj = new Task();
        queryObj.id = '';
        queryObj.projectId = req.params.projectid;
        await this._repo.getByQuery(queryObj).then((value) => {
          res.json(value);
        }).catch((e) =>{
          res.send(e);
        });
      };

      async upsert(req, res) {
        try{
          var obj = req.body;
          var task = new Task(obj.id);
          usr.createdDate = obj.createdDate;
          usr.updateDate = obj.updateDate;

          usr.name = obj.name;
          usr.color = obj.color;

          usr.description = obj.description;
          usr.taskType = obj.taskType;
          usr.estimation = obj.estimation;
          usr.status = obj.status;
          usr.geographicZone = obj.geographicZone;
          usr.timeZone = obj.timeZone;
          usr.workDomain = obj.workDomain;
          usr.attachedAccountId = obj.attachedAccountId;
          
          await this._repo.upsert(task);
          res.json();
        } catch (e) {
          console.log('ProjectControler error: ' + e);
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
