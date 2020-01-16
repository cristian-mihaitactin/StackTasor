const azure = require('azure-storage');
const AzureTableRepository = require('./azureTableRepository');
const User = require('../../models/db/user');
const entGen = azure.TableUtilities.entityGenerator;

const tableName = 'Users';
const latestUserVersion = 'user-v1';

class UserRepository { // Inject tableService for testing purposes
    constructor(azureRepository) {
        if (azureRepository === undefined || azureRepository === null) {
            this._azureRepository = new AzureTableRepository(tableName);
        } else {
            this._azureRepository = azureRepository;
        }
    }

    get(userId) {
        var entity = this._azureRepository.get(latestUserVersion, userId);
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
    remove(id) {
        var response = this._azureRepository.remove(latestUserVersion, id);
        return response;
    }
    modelToEntity(model) {
        var entity = {
            PartitionKey: entGen.String(this.latestUserVersion),
            RowKey: entGen.Guid(model.id),
            CreatedDate: entGen.DateTime(model.createdDate),
            UpdateDate: entGen.DateTime(model.updateDate),
            AccountType: entGen.String(model.accountType),
            UserName: entGen.String(model.username),
            Password: entGen.String(model.password),
            Email: entGen.String(model.email)
        };
        return entity;
    }
    entityToModel(entity) {
        var model = new User(entity.RowKey._);

        model.createdDate = entity.CreatedDate._;
        model.updateDate = entity.UpdateDate._;
        model.accountType = entity.AccountType._;
        model.username = entity.UserName._;
        model.password = entity.Password._;
        model.email = entity.Email._;

        return model;
    }
}

module.exports = UserRepository;
