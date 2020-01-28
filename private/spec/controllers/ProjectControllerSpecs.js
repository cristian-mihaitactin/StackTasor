var azure = require('azure-storage');
const ProjectController = require('../../controller/projectController');
const ProjectRepository = require('../../db/projectRepo');
const AzureTableRepository = require('../../db/azureTableRepository');
const Project = require('../../entities/project');

const test_tableName = 'TestProject';
const deleteTable = true;
const deleteCreatedEntries = true;

var azRepo;// = new AzureTableRepository(test_tableName);
// setTimeout(() => {
// }, 1000);
var  projectRepo;// = new ProjectRepository(azRepo);
var  projectController;// = new ProjectController(projectRepo);

var createdEntry = '';
var accountId = "e80bf620-87e8-47ec-a07f-e2e4d56bfc2f";

describe('ProjectController', function () {
    var resJson = '';
    var resSend = '';
    var res = {
        json : (val) => {
            resJson = val;
        },
        send : (val) => {
            resSend = val;
        }
    };
    var req = {};

    describe('Moq', function() {
        var tableStorageMoq = new azure.TableService();

        beforeAll(() => {
            spyOn(tableStorageMoq, 'createTableIfNotExists').and.callFake(function (
                tableName
            ) {
                tableCreated = true;
                return {
                    error: false,
                    result: '',
                    response: ''
                };
            });

            azRepo = new AzureTableRepository('MoqTable', tableStorageMoq);
            projectRepo = new ProjectRepository(azRepo);
            projectController = new ProjectController(projectRepo);
        });
    
        afterEach(async () => {
        });
    
        afterAll(async () => {
            // if (deleteTable) {
            //     console.log('Deleting table!')
            //     await projectRepo.removeTable(test_tableName);
            //     console.log('Table deleted?!')
            // }
        });
    
        beforeEach(() => {
            createdEntry = new Project('618c66a7-b3b7-4fa9-8798-d984684ce147');
            createdEntry.name = "Crated test task";
            createdEntry.color = "green";
            createdEntry.accountId = accountId;
    
            req.params = {
                id: createdEntry.id,
                userid: accountId
    
            };
            req.body = createdEntry;
    
            resJson = undefined;
            resSend = undefined;
        });
    
        it('should get projects by user Id', async () =>{
            //Check if user does not exist
            //queryEntities<T>(table: string, tableQuery: TableQuery, currentToken: TableService.TableContinuationToken, options: TableService.TableEntityRequestOptions, callback: ErrorOrResult<TableService.QueryEntitiesResult<T>>): void;
            var expected1 = new Project('e484fa9b-6308-49e5-8351-d4111cf62361');
            expected1.name = "Test task #1";
            expected1.color = "blue";
            expected1.accountId = accountId;

            var expected2 = new Project('df67a4cb-225c-4d51-a3d8-5ec7f2710d9a');
            expected2.name = "Test task #2";
            expected2.color = "yellow";
            expected2.accountId = accountId;

            var entityList = new Array();
            entityList.push(projectRepo.modelToEntity(expected1));
            entityList.push(projectRepo.modelToEntity(expected2));

            var modelList = new Array();
            modelList.push(expected1);
            modelList.push(expected2);

            spyOn(tableStorageMoq, 'queryEntities').and.callFake(function (
                table,
                tableQuery,
                options,
                callback
            ) {
                callback(false, {
                    entries: entityList
                }, null);
            });

            await projectController.getByUserId(req, res);
    
            expect(resJson).not.toBeUndefined();
            expect(resSend).toBeUndefined();
            expect(JSON.stringify(modelList)).toEqual(JSON.stringify(resJson));
        })
    })

    
});