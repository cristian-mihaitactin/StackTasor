const UserRepository = require('../db/userRepo');
const ProjectRepository = require('../db/projectRepo');
const TaskRepository = require('../db/taskRepo');
const User = require('../entities/user');
const Project = require('../entities/project');
const Task = require('../entities/task');
const Statistic = require('../entities/statistics');
const tableName = 'Users';
const uuidv1 = require('uuid/v1');


class UserController {
  constructor(repo){
    if (repo === undefined || repo === null) {
      this._repo = new UserRepository();
    } else {
      this._repo = repo;
    }

    this._projectRepo = new ProjectRepository();
    this._taskRepo = new TaskRepository();
  }

  async getStats(req, res) {
    var returnStats = new Statistic(req.params.id);
    var projectCreatedQuery = new Project();
    projectCreatedQuery.id = "";
    projectCreatedQuery.accountId = req.params.id;

    // Get "Created" Section
    await this._projectRepo.getByQuery(projectCreatedQuery).then(async (values) => {
      //projects created
      console.log('USERCONTROLLER.PROJECTS!!!: ' + JSON.stringify(values));
      if (values) {
        console.log("IF VALUES");
        var itemsProcessed = 0;
        values.forEach(async (val) => {
            //tasks created
          var tasksCreatedQuery = new Task();
          tasksCreatedQuery.id = "";
          tasksCreatedQuery.createdDate = "";
          tasksCreatedQuery.updateDate = "";
          tasksCreatedQuery.projectId = val.id;
          //get tasks
          await this._taskRepo.getByQuery(tasksCreatedQuery).then(async (tasks) => {
            if (tasks) {
              returnStats.taskCreatedList.push(...tasks);
            }
            itemsProcessed++;
          })
          
          if(itemsProcessed === values.length) {
            // Get "Worked on" Section
            var tasksCWorkedQuery = new Task();
            tasksCWorkedQuery.id = "";
            tasksCWorkedQuery.createdDate = "";
            tasksCWorkedQuery.updateDate = "";
            // tasksCWorkedQuery.projectId = val.id;
            tasksCWorkedQuery.attachedAccountId = req.params.id;
            //get tasks
            await this._taskRepo.getByQuery(tasksCWorkedQuery).then(async (workingtasks) => {
            //tasks worked on
            console.log('Worked tasks: ' + JSON.stringify(workingtasks));
              if (workingtasks) {
                returnStats.tasksDoneList.push(...workingtasks);
              }
              // Promise.resolve();
              console.log('Last then: ' + JSON.stringify(returnStats));
              res.json(returnStats);
            })
          }
        })
      }else {
        res.json(returnStats);
      }
      
      // console.log('Last then: ' + JSON.stringify(returnStats));
      // res.json(returnStats);
    })//end then project
    .catch((e) =>{
      res.send(e);
    });
    
    // console.log('Last then: ' + JSON.stringify(returnStats));
    // res.json(returnStats)
    //console.log('Last then: ' + JSON.stringify(returnStats));
  };

  async get(req, res) {
      await this._repo.get(req.params.id).then((value) => {
        res.json(value);
      }).catch((e) =>{
        res.send(e);
      });
    };
    // getQuery

    async getQuery(req, res) {
      var usr = this.jsonToObject(req.body);
      await this._repo.getByQuery(usr).then((value) => {
        res.json(value);
      }).catch((e) =>{
        res.send(e);
      });
    };

  async upsert(req, res) {
    try{
      var usr = this.jsonToObject(req.body);

      if (usr.id == '') {
        usr = uuidv1();
      } else {
        usr.id = usr.id._;
      }

      await this._repo.upsert(usr);

      setTimeout(async () => {
        req.params['id'] = usr.id;
        await this.get(req, res);
          }, 1000);
    } catch (e) {
      console.log('UserControler error: ' + e);
      res.send(e);
    }
  };

  async remove(req, res) {
    await this._repo.remove(req.params.id).then((value) => {
      res.json(value);
    }).catch((e) =>{
      res.send(e);
    });
  };

  jsonToObject(obj){
    var usr = new User(obj.id);
    usr.createdDate = obj.createdDate;
    usr.updateDate = obj.updateDate;
    usr.accountType = obj.accountType;
    usr.username = obj.username;
    usr.password = obj.password;
    usr.email = obj.email;

    return usr;
  }
}

module.exports = UserController;
