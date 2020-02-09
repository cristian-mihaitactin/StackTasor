const SubscriptionRepository = require('../db/subscriptionRepo');

const tableName = 'Subscriptions';


class SubscriptionController {
  constructor(repo){
    if (repo === undefined || repo === null) {
      this._repo = new SubscriptionRepository();
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
}

module.exports = SubscriptionController;
