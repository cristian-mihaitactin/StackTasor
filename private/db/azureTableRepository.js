var azure = require('azure-storage');

class AzureTableRepository {
    constructor(tableName){
        if (typeof myVar === 'string' || myVar instanceof String) {
            this._tableName = tableName;
            this.tableService = azure.createTableService();
            this.tableService.createTableIfNotExists(tableName, function(error, result, response) {
              if (error) {
                // result contains true if created; false if already exists
                throw "Table \"" + tableName  + "\" could not be created."
              }
            });
        }
        throw "Table name must be a string!"
    }

    get(rowKey, partitionKey){
        this.tableService.retrieveEntity(this._tableName, partitionKey, rowKey, function(error, result, response) {
            if (!error) {
              // result contains the entity
              return result;
            }
          });
    }
    getByQuery(query){
      this..queryEntities(this._tableName, query, null, function(error, result, response) {
        if (!error) {
          // result.entries contains entities matching the query
          return result.entries;
        }
      });
    }
    upsert(entity) {
        this.tableService.insertOrReplaceEntity(this._tableName, entity, function(error, result, response) {
            if (!error) {
              // result contains the entity with field 'taskDone' set to `true`
            }
          });
    }
    remove(rowKey, partitionKey){
        var task = {
            PartitionKey: {'_':partitionKey},
            RowKey: {'_': rowKey}
          };

        this.tableService.deleteEntity(this._tableName, task, function(error, response){
            if(!error) {
                // Entity deleted
            }
        });
    }
}

module.exports = AzureTableRepository;