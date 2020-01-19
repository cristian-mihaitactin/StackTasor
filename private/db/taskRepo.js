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
    var model = new Task(entity.RowKey._);
    model.projectId = entity.ProjectId._;
    model.decription = entity.Decription._;
    model.taskType = entity.TaskType._;
    model.estimation = entity.Estimation._;
    model.status = entity.Status._;
    model.geographicZone = entity.GeographicZone._;
    model.timeZone = entity.TimeZone._;
    model.workDomain = entity.WorkDomain._;
    model.attachedAccountId = entity.AttachedAccountId._;


    model.name = entity.Name._;
    model.color = entity.Color._;

    model.createdDate = entity.CreatedDate._;
    model.updateDate = entity.UpdateDate._;

    return model;
  }
}

module.exports = TaskRepository;