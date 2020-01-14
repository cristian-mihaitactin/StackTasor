var azure = require('azure-storage');

class AzureTableRepository {
    constructor(tableName){
      if (typeof myVar !== 'string' && !(myVar instanceof String)) {
        throw "Table name must be a string!"
        }

      this._tableName = tableName;

      this._tableService = azure.createTableService();
      this._tableService.createTableIfNotExists(tableName, function(error, result, response) {
        if (error) {
          // result contains true if created; false if already exists
          throw "Table \"" + tableName  + "\" could not be created."
        }
      });
    }

    //Inject tableService for testing purposes
    constructor(tableName, tableService){
      if (typeof myVar !== 'string' && !(myVar instanceof String)) {
        throw "Table name must be a string!"
      }

      this._tableName = tableName;
      this._tableService = tableService;
      this._tableService.createTableIfNotExists(tableName, function(error, result, response) {
        if (error) {
          // result contains true if created; false if already exists
          throw "Table \"" + tableName  + "\" could not be created."
        }
      });
  }

    get(partitionKey, rowKey){
        this._tableService.retrieveEntity(this._tableName, partitionKey, rowKey, function(error, result, response) {
            if (!error) {
              // result contains the entity
              return result;
            }else{
              throw "Unable to retrieve entity: PartitionKey: " + partitionKey + ", RowKey: " + rowKey + ".";
            }
          });
    }
    getByQuery(query){
      this._tableService.queryEntities(this._tableName, query, null, function(error, result, response) {
        if (!error) {
          // result.entries contains entities matching the query
          return result.entries;
        }else{
          throw "Unable to retrieve entity: Query: " + query + ".";
        }
      });
    }
    upsert(entity) {
        this._tableService.insertOrReplaceEntity(this._tableName, entity, function(error, result, response) {
            if (!error) {
              // result contains the entity with field 'taskDone' set to `true`
            }else{
              throw "Unable to upsert entity: PartitionKey: " + entity + ".";
            }
          });
    }
    remove(partitionKey, rowKey){
        var task = {
            PartitionKey: {'_':partitionKey},
            RowKey: {'_': rowKey}
          };

        this._tableService.deleteEntity(this._tableName, task, function(error, response){
            if(!error) {
                // Entity deleted
                return response;
            }else{
              throw "Unable to remove entity: PartitionKey: " + partitionKey + ", RowKey: " + rowKey + ".";
            }
        });
    }
}

module.exports = AzureTableRepository;