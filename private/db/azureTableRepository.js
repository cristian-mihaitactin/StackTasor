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
                console.log(error);
                throw new Error("Table \"" + tableName + "\" could not be created.");
            }
        });
    }

    removeTable(removeTableName) {
        let toRemoveName = removeTableName;
        if (removeTableName === undefined || removeTableName === null) {
            toRemoveName = this._tableName;
        }

        return new Promise((resolve, reject) => {
            this._tableService.deleteTableIfExists (toRemoveName, function(error, response){
                if(!error){
                    // Table deleted
                    resolve(response);
                } else {
                    reject(error);
                }
            });
        })
    }
    get(partitionKey, rowKey) {
        return new Promise((resolve, reject) => {
            this._tableService.retrieveEntity(this._tableName, partitionKey, rowKey, function (error, result, response) {
                if (! error) { // result contains the entity
                    console.log('Entity.datetime = ' + result.CreatedDate);
                    return resolve(result);
                } else {
                    reject("Unable to retrieve entity: PartitionKey: " + partitionKey + ", RowKey: " + rowKey + ". Error: " + error);
                }
            });
        });
    }
    getByQuery(query) {
        return new Promise((resolve, reject) => {
            this._tableService.queryEntities(this._tableName, query, null, function (error, result, response) {
                if (! error) { // result.entries contains entities matching the query
                    return resolve(result.entries);
                } else {
                    reject("Unable to retrieve entity: Query: " + query + ". Error: " + error);
                }
            });
        });

        return repoResponse;
    }
    upsert(entity) {
        return new Promise((resolve, reject) => {
            
            // this._tableService.doesTableExist(this._tableName, null, function(error, result, response) {
            // });
            this._tableService.insertOrMergeEntity(this._tableName, entity, function (error, result, response) {
                if (! error) { // result contains the entity with field 'taskDone' set to `true`
                    resolve(result);
                } else {
                    reject("Unable to upsert entity: PartitionKey: " + entity + ". Error: " + error);
                }
            });
        });
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
      return new Promise((resolve, reject) => {
        this._tableService.deleteEntity(this._tableName, task, function (error, response) {
            if (! error) { // Entity deleted
              resolve(response);
            } else {
              reject("Unable to remove entity: PartitionKey: " + partitionKey + ", RowKey: " + rowKey + ". Error: " + error);
            }
        });
    });
  }
}

module.exports = AzureTableRepository;
