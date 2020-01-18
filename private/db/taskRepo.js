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
    var entity = {
      PartitionKey: entGen.Guid(model.projectId),
      RowKey: entGen.Guid(model.id),
      ProjectId: entGen.Guid(model.projectId),
      Decription: entGen.String(model.decription),
      TaskType: entGen.String(model.taskType),
      Estimation: entGen.Double(model.estimation),
      Status: entGen.Int32(model.status),
      GeographicZone: entGen.String(model.geographicZone),
      TimeZone: entGen.String(model.timeZone),
      WorkDomain: entGen.String(model.workDomain),
      AttachedAccountId: entGen.Guid(model.attachedAccountId),

      Name: entGen.String(model.name),
      Color: entGen.String(model.color),

      CreatedDate: entGen.DateTime(model.createdDate),
      UpdateDate: entGen.DateTime(model.updateDate)
    };
    return entity;
  }
  entityToModel(entity) {
    var model = new Task(entity.RowKey);
    model.projectId = entity.ProjectId;
    model.decription = entity.Decription;
    model.taskType = entity.TaskType;
    model.estimation = entity.Estimation;
    model.status = entity.Status;
    model.geographicZone = entity.GeographicZone;
    model.timeZone = entity.TimeZone;
    model.workDomain = entity.WorkDomain;
    model.attachedAccountId = entity.AttachedAccountId;


    model.name = entity.Name;
    model.color = entity.Color;

    model.createdDate = entity.CreatedDate;
    model.updateDate = entity.UpdateDate;

    return model;
  }
}

module.exports = TaskRepository;