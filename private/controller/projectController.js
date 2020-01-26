const ProjectRepository = require('../db/projectRepo');
const Project = require('../../models/db/project');
const uuidv1 = require('uuid/v1');

class ProjectController {
    constructor(repo){
        if (repo === undefined || repo === null) {
          this._repo = new ProjectRepository();
        } else {
          this._repo = repo;
        }
      }
      // getByUserId
      async getByUserId(req, res) {
        console.log('ProjectController.getByUserId: userId=' + req.params.userid);
        var queryObj = new Project();
        queryObj.id = undefined;
        queryObj.name = undefined;
        queryObj.color = undefined;
        queryObj._accountId = req.params.userid;
        await this._repo.getByQuery(queryObj).then((value) => {
          console.log('ProjectController.getByUserId: value=' + JSON.stringify(value));

          res.json(value);
        }).catch((e) =>{
          res.send(e);
        });
      };

      async get(req, res) {
        await this._repo.get(req.params.userid, req.params.id).then((value) => {
          res.json(value);
        }).catch((e) =>{
          res.send(e);
        });
      };

      async upsert(req, res) {
        try{
          
          var obj = req.body;
          //if (queryObject.accountId !== undefined || queryObject.accountId != null) {
          
          if (obj.id._ === undefined || obj.id._ == null || obj.id._ == '' || obj.id._ == 'undefined') {
            obj.id = uuidv1();
          } else {
            obj.id = req.body.id._;
          }
          
          var modelObj = new Project(obj.id);
          modelObj.createdDate = obj.createdDate;
          modelObj.updateDate = obj.updateDate;
          modelObj.name = obj.name;
          modelObj.color = obj.color;
          modelObj.accountId = obj.accountId;
          
          await this._repo.upsert(modelObj);
          setTimeout(async () => {
            req.params['id'] = modelObj.id;
            await this.get(req, res);
              }, 1000);
        } catch (e) {
          console.log('ProjectControler error: ' + e);
          res.send(e);
        }
      };

      async remove(req, res) {
        await this._repo.remove(req.params.userid, req.params.id).then((value) => {
          res.json(value);
        }).catch((e) =>{
          res.send(e);
        });
      };
}

module.exports = ProjectController;
