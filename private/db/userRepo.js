const azure = require('azure-storage');
const AzureTableRepository = require('./azureTableRepository');
const User = require('../../models/db/user');
const entGen = azure.TableUtilities.entityGenerator;

const tableName = 'Users';
const latestUserVersion = 'user-v1';

class UserRepository {
  //Inject tableService for testing purposes
  constructor(azureRepository) {
    if (azureRepository === undefined || azureRepository === null) {
      this._azureRepository = new AzureTableRepository(tableName);
    } else {
      this._azureRepository = azureRepository;
    }
  }

  async removeTable(removeTableName) {
    console.log('here')
    if (removeTableName === undefined || removeTableName === null) {
      await this._azureRepository.removeTable(removeTableName);
    } else {
      this._azureRepository.removeTable(tableName);
    }
  }
  
  async get(userId) {
    var model = '';
    await this._azureRepository.get(latestUserVersion, userId).then((value) => {
      console.log('Get value = ' + value)
      model = this.entityToModel(value);
    }).catch(
     (reason) => {
          console.log('Get handle rejected promise ('+reason+') here.');
          throw new Error(reason);
      });

    return model;
  }
  async getByQuery(query) {
    var modelArray = new Array();
    await this._azureRepository.getByQuery(query).then((value) => {
      value.forEach((item, index) => {
        var model = this.entityToModel(item);
        modelArray.push(model);
      });
    }).catch(
      (reason) => {
           console.log('GetByQuery handle rejected promise ('+reason+') here.');
           throw new Error(reason);
       });
    return modelArray;
  }
  async upsert(model) {
    model.update();
    var entity = this.modelToEntity(model);

    this._azureRepository.upsert(entity).then((value) => {
      this.entityToModel(value);
    }).catch((e) => {
      console.log('Upsert handle rejected promise ('+e+') here.');
      throw new Error(e);
    });
  }
  async remove(id) {
    await this._azureRepository.remove(latestUserVersion, id).then(
      (value) => {

      }).catch(
        (reason) => {
             console.log('Remove handle rejected promise ('+reason+') here.');
             throw new Error(reason);
         });
  }
  modelToEntity(model) {
    var entity = {
      PartitionKey: entGen.String(latestUserVersion),
      RowKey: entGen.Guid(model.id),
      CreatedDate: entGen.DateTime(model.createdDate),
      UpdateDate: entGen.DateTime(model.updateDate),
      AccountType: entGen.String(model.accountType),
      UserName: entGen.String(model.username),
      Password: entGen.String(model.password),
      Email: entGen.String(model.email),
    };
    return entity;
  }
  entityToModel(entity) {
    var model = new User(entity.RowKey);
    model.createdDate = entity.CreatedDate;
    model.updateDate = entity.UpdateDate;
    model.accountType = entity.AccountType;
    model.username = entity.UserName;
    model.password = entity.Password;
    model.email = entity.Email;

    return model;
  }
}

module.exports = UserRepository;