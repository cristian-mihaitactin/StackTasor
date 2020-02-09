const azure = require('azure-storage');
const AzureTableRepository = require('./azureTableRepository');
const entGen = azure.TableUtilities.entityGenerator;

const tableName = 'Subscriptions';
const latestVersion = 'subscription-v1';

class SubscriptionRepository {
  //Inject tableService for testing purposes
  constructor(azureRepository) {
    if (azureRepository === undefined || azureRepository === null) {
      this._azureRepository = new AzureTableRepository(tableName);
    } else {
      this._azureRepository = azureRepository;
    }
  }

  async removeTable(removeTableName) {
    if (removeTableName === undefined || removeTableName === null) {
      await this._azureRepository.removeTable(removeTableName);
    } else {
      this._azureRepository.removeTable(tableName);
    }
  }
  
  async get(userId) {
    var model = '';
    await this._azureRepository.get(latestVersion, userId).then((value) => {
      console.log('Get value = ' + value)
      model = this.entityToModel(value);
    }).catch(
     (reason) => {
          console.log('Get handle rejected promise ('+reason+') here.');
          throw new Error(reason);
      });

    return model;
  }
  async upsert(model) {
    console.log('upsert(model)= ',model);

    var entity = this.modelToEntity(model);
    this._azureRepository.upsert(entity).then(async (value) => {
      await this._azureRepository.get(latestVersion, model.userId).then((value) => {
        console.log('Get value = ' + value)
        model = this.entityToModel(value);
      });
    }).catch((e) => {
      console.log('Upsert handle rejected promise ('+e+') here.');
      throw new Error(e);
    });
  }
  async remove(id) {
    await this._azureRepository.remove(latestVersion, id).then(
      (value) => {

      }).catch(
        (reason) => {
             console.log('Remove handle rejected promise ('+reason+') here.');
             throw new Error(reason);
         });
  }
  modelToEntity(model) {
    var entity = {
      PartitionKey: entGen.String(latestVersion),
      RowKey: entGen.Guid(model.userId),
      Endpoint: entGen.String(model.endpoint),
      P256dh: entGen.String(model.p256dh),
      Auth: entGen.String(model.auth)

    };
    return entity;
  }
  entityToModel(entity) {
    var model = {
      userId : entity.RowKey._,
      endpoint: entity.Endpoint._,
      p256dh : entity.P256dh._,
      auth : entity.Auth._

    }

    return model;
  }
}

module.exports = SubscriptionRepository;