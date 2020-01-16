const azure = require('azure-storage');
const AzureTableRepository = require('./azureTableRepository');
const Task = require('../../models/db/task');
const entGen = azure.TableUtilities.entityGenerator;

const tableName = 'Tasks';

class TaskRepository { // Inject tableService for testing purposes
    constructor(azureRepository) {
        if (azureRepository === undefined || azureRepository === null) {
            this._azureRepository = new AzureTableRepository(tableName);
        } else {
            this._azureRepository = azureRepository;
        }
    }

    get(projectId, id) {
        var entity = this._azureRepository.get(projectId, id);
        var model = this.entityToModel(entity);
        return model;
    }
    getByQuery(query) {
        var entity = this._azureRepository.getByQuery(query);
        var model = this.entityToModel(entity);
        return model;
    }
    upsert(model) {
        model.update();
        var entity = this.modelToEntity(model);
        var newEntity = this._azureRepository.upsert(entity);
        var newModel = this.entityToModel(newEntity);
        return newModel;
    }
    remove(projectId, id) {
        var response = this._azureRepository.remove(projectId, id);
        return response;
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


        model.name = entity.Name;
        model.color = entity.Color;

        model.createdDate = entity.CreatedDate;
        model.updateDate = entity.UpdateDate;

        return model;
    }
}

module.exports = TaskRepository;
