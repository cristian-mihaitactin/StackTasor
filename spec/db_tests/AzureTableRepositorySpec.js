
var azure = require('azure-storage');

describe("AzureTableRepository", function() {
  var AzureTableRepository = require('../../private/db/azureTableRepository');
  var repo;
  var tableStorage;//zurestorage.services.table.TableService();
  var tableCreated = false;
  beforeEach(function() {
    tableCreated = false;

    tableStorage = new azure.TableService();
    spyOn(tableStorage, "createTableIfNotExists").and.callFake(function(tableName) {
        tableCreated = true;
        return {
            error: false,
            result: "",
            response: ""
        }
      });
  });

  it("should create table if it does not exist", function() {
    tableStorage = new azure.TableService();
    spyOn(tableStorage, "createTableIfNotExists").and.callFake(function(tableName) {
        tableCreated = true;
        return {
            error: false,
            result: "",
            response: ""
        }
      });
    repo = new AzureTableRepository('SpecTable', tableStorage);

    expect(tableStorage.createTableIfNotExists).toHaveBeenCalled();
    expect(tableCreated).toEqual(true);
    expect(repo._tableName).toEqual('SpecTable');
  });

  it("should NOT create table if no name is given", function() {
    

    expect(() => {
      repo = new AzureTableRepository(undefined, tableStorage)
    }).toThrowError("Table name must be a string!");

    expect(tableStorage.createTableIfNotExists).not.toHaveBeenCalled();
    expect(tableCreated).toEqual(false);
  });

  // // can't do it because of the callback function
  // it("should NOT create table if there was error", function() {
  //   tableStorage = new azure.TableService();
  //   tableName = 'SpecTable'
  //   spyOn(tableStorage, "createTableIfNotExists").and.callFake(function(tableName) {
  //       return false;
  //     });

  //   var errorExpected = "Table \"" + tableName  + "\" could not be created."
  //   expect(() => {
  //     repo = new AzureTableRepository(tableName, tableStorage)
  //   }).toThrowError(errorExpected);

  //   expect(tableStorage.createTableIfNotExists).toHaveBeenCalled();
  //   expect(tableCreated).toEqual(false);
  // });


});
