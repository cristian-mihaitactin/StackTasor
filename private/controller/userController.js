const UserRepository = require('../db/userRepo');
const User = require('../../models/db/user');

class UserController {
  constructor(repo){
    if (repo === undefined || repo === null) {
      this._repo = new UserRepository(repo);
    } else {
      this._repo = repo;
    }
  }

  async get(req, res) {
      await this._repo.get(req.params.id).then((value) => {
        res.json(value);
      }).catch((e) =>{
        res.send(e);
      });
    };

  async upsert(req, res) {
    try{
      /*
      console.log(req.body);
      var obj = JSON.parse(req.body);
      console.log(obj);
*/
      var obj = req.body;
      var usr = new User(obj.id);
      usr.createdDate = obj.createdDate;
      usr.updateDate = obj.updateDate;
      usr.accountType = obj.accountType;
      usr.username = obj.username;
      usr.password = obj.password;
      usr.email = obj.email;
      
      await this._repo.upsert(usr);
      res.json();
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

  jsonToObject(jsonString){
    var obj = JSON.parse(jsonString);
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
