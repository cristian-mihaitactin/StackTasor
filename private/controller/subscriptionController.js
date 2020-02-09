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
    console.log('SubscriptionController error: ', req.body);

    try{
      var usr = this.jsonToObject(req.body);

      await this._repo.upsert(usr);

      setTimeout(async () => {
        req.params['id'] = usr.userId;
        await this.get(req, res);
          }, 1000);
    } catch (e) {
      console.log('SubscriptionController error: ' + e);
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
    var model = {
      userId: obj.userId,
      endpoint: obj.endpoint,

      p256dh: obj.keys.p256dh,
      auth: obj.keys.auth
    }

    return model;
  }
}

module.exports = SubscriptionController;
