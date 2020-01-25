const UserRepository = require('../db/userRepo');
const User = require('../../models/db/user');
const tableName = 'Users';
const uuidv1 = require('uuid/v1');


class UserController {
  constructor(repo){
    if (repo === undefined || repo === null) {
      this._repo = new UserRepository();
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
      /*
      console.log(req.body);
      var obj = JSON.parse(req.body);
      console.log(obj);
*/
      // var obj = req.body;
      // var usr = new User(obj.id);
      // usr.createdDate = obj.createdDate;
      // usr.updateDate = obj.updateDate;
      // usr.accountType = obj.accountType;
      // usr.username = obj.username;
      // usr.password = obj.password;
      // usr.email = obj.email;

      var usr = this.jsonToObject(req.body);
      console.log('UserController BEFORE reqBody: ' + JSON.stringify(usr));

      if (usr.id == '') {
        usr = uuidv1();
      } else {
        usr.id = usr.id._;
      }
      console.log('UserController reqBody: ' + JSON.stringify(usr));
    //   await this._repo.upsert(usr).then(() => {
    //     req.params['id'] = usr.id;
    //     setTimeout(function(){
    //       this.get(req, res);
    //   }, 1000);
    // });

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
