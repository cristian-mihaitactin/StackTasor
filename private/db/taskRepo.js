const azure = require('azure-storage');
const AzureTableRepository = require('./azureTableRepository');
const Task = require('../../models/db/task');
const entGen = azure.TableUtilities.entityGenerator;

const tableName = 'Tasks';

class TaskRepository {
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
  
  async get(projectId, id) {
    var model = '';
    await this._azureRepository.get(projectId, id).then((value) => {
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
    var queryEntity = this.modelToEntity(queryObject);
    // console.log('TaskRepo.getByQuery: value=' + JSON.stringify(queryEntity))

    var query = new azure.TableQuery()
    // .where();
    var whereUsed = false;
    if (queryObject.projectId != undefined || queryObject.projectId != null) {
      if (whereUsed) {
        console.log('whereUsed');
        query.and('PartitionKey eq ?', queryEntity.PartitionKey._);
        console.log('whereUsed after');

      } else {
        console.log('!whereUsed');

        query.where('PartitionKey eq ?', queryEntity.PartitionKey._);
        whereUsed = true;
        console.log('!whereUsed after');

      }
    }
    if (queryObject.name != undefined || queryObject.name != null) {
      console.log('here');
      if (whereUsed) {
        query.and('Name eq ?', queryObject.name);
      } else {
        query.where('Name eq ?', queryObject.name);
        whereUsed = true;
      }
    }
    if (queryObject.color != undefined || queryObject.color != null) {
      console.log('here');
      if (whereUsed) {
        query.and('Color eq ?', queryObject.color);
      } else {
        query.where('Color eq ?', queryObject.color);
        whereUsed = true;
      }
    }
    // if (queryObject.projectId != undefined || queryObject.projectId != null) {
    //   if (whereUsed) {
    //     query.and('ProjectId eq ?', queryObject.projectId);
    //   } else {
    //     query.where('ProjectId eq ?', queryObject.projectId);
    //     whereUsed = true;
    //   }
    // }
    if (queryObject.description != undefined || queryObject.description != null) {
      console.log('1here');
      if (whereUsed) {
        query.and('Description eq ?', queryObject.description);
      } else {
        query.where('Description eq ?', queryObject.description);
        whereUsed = true;
      }
    }
    if (queryObject.taskType != undefined || queryObject.taskType != null) {
      console.log('2here');
      if (whereUsed) {
        query.and('TaskType eq ?', queryObject.taskType);
      } else {
        query.where('TaskType eq ?', queryObject.taskType);
        whereUsed = true;
      }
    }
    if (queryObject.estimation != undefined || queryObject.estimation != null) {
      console.log('3here');
      if (whereUsed) {
        query.and('Estimation eq ?', queryObject.estimation);
      } else {
        query.where('Estimation eq ?', queryObject.estimation);
        whereUsed = true;
      }
    }
    if (queryObject.status != undefined || queryObject.status != null) {
      console.log('4here');
      if (whereUsed) {
        query.and('Status eq ?', queryObject.status);
      } else {
        query.where('Status eq ?', queryObject.status);
        whereUsed = true;
      }
    }
    if (queryObject.geographicZone != undefined || queryObject.geographicZone != null) {
      console.log('5here');
      if (whereUsed) {
        query.and('GeographicZone eq ?', queryObject.geographicZone);
      } else {
        query.where('GeographicZone eq ?', queryObject.geographicZone);
        whereUsed = true;
      }
    }
    if (queryObject.timeZone != undefined || queryObject.timeZone != null) {
      console.log('6here');
      if (whereUsed) {
        query.and('TimeZone eq ?', queryObject.timeZone);
      } else {
        query.where('TimeZone eq ?', queryObject.timeZone);
        whereUsed = true;
      }
    }
    if (queryObject.workDomain != undefined || queryObject.workDomain != null) {
      console.log('7here');
      if (whereUsed) {
        query.and('WorkDomain eq ?', queryObject.workDomain);
      } else {
        query.where('WorkDomain eq ?', queryObject.workDomain);
        whereUsed = true;
      }
    }
    if (queryObject.attachedAccountId != undefined || queryObject.attachedAccountId != null) {
      console.log('8here');
      if (whereUsed) {
        query.and('AttachedAccountId eq ?', queryObject.attachedAccountId);
      } else {
        query.where('AttachedAccountId eq ?', queryObject.attachedAccountId);
        whereUsed = true;
      }
    }
    if (queryObject.evidence != undefined || queryObject.evidence != null) {
      console.log('9here');
      if (whereUsed) {
        query.and('Evidence eq ?', queryObject.evidence);
      } else {
        query.where('Evidence eq ?', queryObject.evidence);
        whereUsed = true;
      }
    }
    console.log('hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');

    var modelArray = new Array();
    console.log('TaskRepo.query: value=' + JSON.stringify(query))
    await this._azureRepository.getByQuery(query).then((value) => {
      value.forEach((item, index) => {
        var model = this.entityToModel(item);
        console.log('TaskRepo ENTITY return: ' + JSON.stringify(model));

        modelArray.push(model);
      });
    }).catch(
      (reason) => {
           console.log('GetByQuery handle rejected promise ('+reason+') here.');
           throw new Error(reason);
       });
    return modelArray;
  }
  upsert(model) {
    console.log('TaskRepo.upsert: model=' + JSON.stringify(model));

    model.update();
    var entity = this.modelToEntity(model);

    this._azureRepository.upsert(entity).then((value) => {
      this.entityToModel(value);
    }).catch((e) => {
      console.log('Upsert handle rejected promise ('+e+') here.');
      throw new Error(e);
    });  
  }
  async remove(projectId, id) {
    await this._azureRepository.remove(projectId, id).then(
      (value) => {
      }).catch(
        (reason) => {
             console.log('Remove handle rejected promise ('+reason+') here.');
             throw new Error(reason);
         });  
  }

  modelToEntity(model) {
    if (model.attachedAccountId == undefined || model.attachedAccountId == null|| model.attachedAccountId == ''|| model.attachedAccountId == 'undefined'){
      model.attachedAccountId = null;
    }
    
    var entity = {
      PartitionKey: entGen.Guid(model.projectId),
      RowKey: entGen.Guid(model.id),
      ProjectId: entGen.Guid(model.projectId),
      Description: entGen.String(model.description),
      TaskType: entGen.String(model.taskType),
      Estimation: entGen.Double(model.estimation),
      Status: entGen.Int32(model.status),
      GeographicZone: entGen.String(model.geographicZone),
      TimeZone: entGen.String(model.timeZone),
      WorkDomain: entGen.String(model.workDomain),
      Evidence: entGen.String(model.evidence),
      AttachedAccountId: entGen.Guid(model.attachedAccountId),

      Name: entGen.String(model.name),
      Color: entGen.String(model.color),

      CreatedDate: entGen.DateTime(model.createdDate),
      UpdateDate: entGen.DateTime(model.updateDate)
    };
    return entity;
  }
  entityToModel(entity) {
    var model = new Task(entity.RowKey._);
    model.projectId = entity.ProjectId._;
    model.description = entity.Description._;
    model.taskType = entity.TaskType._;
    model.estimation = entity.Estimation._;
    model.status = entity.Status._;
    model.geographicZone = entity.GeographicZone._;
    model.timeZone = entity.TimeZone._;
    model.workDomain = entity.WorkDomain._;
    model.evidence = entity.Evidence._;
    if (entity.AttachedAccountId != undefined || entity.AttachedAccountId != null) {
      model.attachedAccountId = entity.AttachedAccountId._;
    }

    model.name = entity.Name._;
    model.color = entity.Color._;

    model.createdDate = entity.CreatedDate._;
    model.updateDate = entity.UpdateDate._;

    return model;
  }
}

module.exports = TaskRepository;