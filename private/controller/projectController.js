const ProjectRepository = require('../db/projectRepo');
const Project = require('../../models/db/project');

class ProjectController {
    constructor(repo){
        if (repo === undefined || repo === null) {
          this._repo = new ProjectRepository(repo);
        } else {
          this._repo = repo;
        }
      }

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
          var proj = new Project(obj.id);
          usr.createdDate = obj.createdDate;
          usr.updateDate = obj.updateDate;
          usr.name = obj.name;
          usr.color = obj.color;
          usr.accountId = obj.accountId;
          
          await this._repo.upsert(proj);
          res.json();
        } catch (e) {
          console.log('UserControler error: ' + e);
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
