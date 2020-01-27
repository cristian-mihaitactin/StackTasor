const TaskRepository = require('../db/taskRepo');
const ProjectRepository = require('../db/projectRepo');
const Task = require('../../models/db/task');
const uuidv1 = require('uuid/v1');

class TaskController {
    constructor(repo, projectRepo){
        if (repo === undefined || repo === null) {
          this._repo = new TaskRepository();
        } else {
          this._repo = repo;
        }
        if (projectRepo === undefined || projectRepo === null) {
          this._projectRepo = new ProjectRepository();
        } else {
          this._projectRepo = projectRepo;
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
        var projAccountId = req.params.userid;
        var queryObj = new Task();
        queryObj.id = '';
        queryObj.projectId = req.params.projectid;
        queryObj.attachedAccountId = '';

        await this._projectRepo.get(projAccountId, req.params.projectid).then(async (projValue) => {
          if (projValue){
            await this._repo.getByQuery(queryObj).then((value) => {
              res.json(value);
            }).catch((e) =>{
              res.send(e);
            });
          }
        }).catch((e) =>{
          res.send(e);
        });
      };

      async upsert(req, res) {
        try{
          var obj = req.body;
          if (obj.id._ === undefined || obj.id._ == null || obj.id._ == '' || obj.id._ == 'undefined') {
            obj.id = uuidv1();
          } else {
            obj.id = req.body.id._;
          }
          console.log('TaskController.upsert: params: ' + JSON.stringify(req.params));
          var taskobj = new Task(obj.id);
          taskobj.createdDate = obj.createdDate;
          taskobj.updateDate = obj.updateDate;

          taskobj.name = obj.name;
          taskobj.color = obj.color;

          taskobj.projectId = req.params.projectid;

          taskobj.description = obj.description;
          taskobj.taskType = obj.taskType;
          taskobj.estimation = obj.estimation;
          taskobj.status = obj.status;
          taskobj.geographicZone = obj.geographicZone;
          taskobj.timeZone = obj.timeZone;
          taskobj.workDomain = obj.workDomain;
          taskobj.attachedAccountId = obj.attachedAccountId;
          taskobj.evidence = obj.evidence;
          await this._repo.upsert(taskobj);
          setTimeout(async () => {
            req.params['id'] = taskobj.id;
            await this.get(req, res);
              }, 1000);
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
