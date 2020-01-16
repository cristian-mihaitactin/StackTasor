var azure = require('azure-storage');
const dotenv = require('dotenv');
dotenv.config();

class AzureTableRepository { // Inject tableService for testing purposes
    constructor(tableName, tableService) {

        if (typeof tableName !== 'string' && !(tableName instanceof String)) {
            throw new Error("Table name must be a string!");
        }

        this._tableName = tableName;
        if (tableService === undefined || tableService === null) {
            this._tableService = azure.createTableService();
        } else {
            this._tableService = tableService;
        }
        this._tableService.createTableIfNotExists(tableName, function (error, result, response) {
            if (error) { // result contains true if created; false if already exists
                throw new Error("Table \"" + tableName + "\" could not be created.");
            }
        });
    }


    get(partitionKey, rowKey) {
        this._tableService.retrieveEntity(this._tableName, partitionKey, rowKey, function (error, result, response) {
            if (! error) { // result contains the entity
                return result;
            } else {
                throw new Error("Unable to retrieve entity: PartitionKey: " + partitionKey + ", RowKey: " + rowKey + ".");
            }
        });
    }
    getByQuery(query) {
        this._tableService.queryEntities(this._tableName, query, null, function (error, result, response) {
            if (! error) { // result.entries contains entities matching the query
                return result.entries;
            } else {
                throw new Error("Unable to retrieve entity: Query: " + query + ".");
            }
        });
    }
    upsert(entity) {
        this._tableService.insertOrReplaceEntity(this._tableName, entity, function (error, result, response) {
            if (! error) { // result contains the entity with field 'taskDone' set to `true`
            } else {
                throw new Error("Unable to upsert entity: PartitionKey: " + entity + ".");
            }
        });

        var newEntity = this.get(entity.PartitionKey, entity.RowKey);
        return newEntity;
    }
    remove(partitionKey, rowKey) {
        var task = {
            PartitionKey: {
                '_': partitionKey
            },
            RowKey: {
                '_': rowKey
            }
        };

        this._tableService.deleteEntity(this._tableName, task, function (error, response) {
            if (! error) { // Entity deleted
                return response;
            } else {
                throw new Error("Unable to remove entity: PartitionKey: " + partitionKey + ", RowKey: " + rowKey + ".");
            }
        });
    }
}

module.exports = AzureTableRepository;
