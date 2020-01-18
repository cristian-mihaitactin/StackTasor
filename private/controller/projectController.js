const ProjectRepository = require('../db/projectRepo');
const Project = require('../../models/db/project');

class ProjectController {
    constructor(repo){
        if (repo === undefined || repo === null) {
          this._repo = new ProjectRepository();
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
          proj.createdDate = obj.createdDate;
          proj.updateDate = obj.updateDate;
          proj.name = obj.name;
          proj.color = obj.color;
          proj.accountId = obj.accountId;
          
          await this._repo.upsert(proj);
          setTimeout(async () => {
            req.params['id'] = usr.id;
            req.params['userid'] = usr.accountId;
            await this.get(req, res);
              }, 1000);

          res.json();
        } catch (e) {
          console.log('ProjectController error: ' + e);
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
