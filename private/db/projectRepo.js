const azure = require('azure-storage');
const AzureTableRepository = require('./azureTableRepository');
const Project = require('../../models/db/project');
const entGen = azure.TableUtilities.entityGenerator;

const tableName = 'Projects';

class ProjectRepository {
  //Inject tableService for testing purposes
  constructor(azureRepository) {
    if (azureRepository === undefined || azureRepository === null) {
      this._azureRepository = new AzureTableRepository(tableName);
    } else {
      this._azureRepository = azureRepository;
    }
  }
  
  async removeTable(tableName) {
    await this._repo.removeTable(tableName);
  }

  async get(accountId, id) {
    var model = '';
    await this._azureRepository.get(accountId, id).then((value) => {
      model = this.entityToModel(value);
    }).catch(
     (reason) => {
          console.log('Get handle rejected promise ('+reason+') here.');
          throw new Error(reason);
      });

    return model;
  }
  async getByQuery(queryObject) {
    //compose query
    var query = new azure.TableQuery()
    // .where();
    var whereUsed = false;
    if (queryObject.accountId !== undefined || queryObject.accountId != null) {
      if (whereUsed) {
        query.and('PartitionKey eq ?', queryObject.accountId);
      } else {
        query.where('PartitionKey eq ?', queryObject.accountId);
        whereUsed = true;
      }
    }
    if (queryObject.name !== undefined || queryObject.name != null) {
      if (whereUsed) {
        query.and('Name eq ?', queryObject.name);
      } else {
        query.where('Name eq ?', queryObject.name);
        whereUsed = true;
      }
    }
    if (queryObject.color !== undefined || queryObject.color != null) {
      if (whereUsed) {
        query.and('Color eq ?', queryObject.color);
      } else {
        query.where('Color eq ?', queryObject.color);
        whereUsed = true;
      }
    }
    if (queryObject.accountId !== undefined || queryObject.accountId != null) {
      if (whereUsed) {
        query.and('AccountId eq ?', queryObject.accountId);
      } else {
        query.where('AccountId eq ?', queryObject.accountId);
        whereUsed = true;
      }
    }
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

  async remove(accountId, id) {
    await this._azureRepository.remove(accountId, id).then(
      (value) => {
      }).catch(
        (reason) => {
             console.log('Remove handle rejected promise ('+reason+') here.');
             throw new Error(reason);
         });
  }

  modelToEntity(model) {
    var entity = {
      PartitionKey: entGen.Guid(model.accountId),
      RowKey: entGen.Guid(model.id),
      AccountId: entGen.Guid(model.accountId),

      Name: entGen.String(model.name),
      Color: entGen.String(model.color),

      CreatedDate: entGen.DateTime(model.createdDate),
      UpdateDate: entGen.DateTime(model.updateDate)
    };
    return entity;
  }
  entityToModel(entity) {
    var model = new Project(entity.RowKey._);
    model.accountId = entity.AccountId._;

    model.name = entity.Name._;
    model.color = entity.Color._;

    model.createdDate = entity.CreatedDate._;
    model.updateDate = entity.UpdateDate._;

    return model;
  }
}

module.exports = ProjectRepository;