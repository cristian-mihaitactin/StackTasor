const azure = require('azure-storage');
const AzureTableRepository = require('./azureTableRepository');
const Project = require('../../models/db/project');
const entGen = azure.TableUtilities.entityGenerator;

const tableName = 'Projects';

class ProjectRepository { // Inject tableService for testing purposes
    constructor(azureRepository) {
        if (azureRepository === undefined || azureRepository === null) {
            this._azureRepository = new AzureTableRepository(tableName);
        } else {
            this._azureRepository = azureRepository;
        }
    }

    get(accountId, id) {
        var entity = this._azureRepository.get(accountId, id);
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
    remove(accountId, id) {
        var response = this._azureRepository.remove(accountId, id);
        return response;
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
