var azure = require('azure-storage');
const ProjectController = require('../../../controller/projectController');
const ProjectRepository = require('../../../db/projectRepo');
const AzureTableRepository = require('../../../db/azureTableRepository');
const Project = require('../../../../models/db/project');

const test_tableName = 'TestProject';
const deleteTable = false;
const deleteCreatedEntries = true;

var azRepo = new AzureTableRepository(test_tableName);
setTimeout(() => {
}, 1000);
const  projectRepo= new ProjectRepository(azRepo);
const  projectController = new ProjectController(projectRepo);

var createdEntry = '';

describe('ProjectController Integration', function () {
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

    beforeAll(() => {
        console.log('Table name: ' + azRepo._tableName);
    });

    afterEach(async () => {
    });

    afterAll(async () => {
        if (deleteTable) {
            console.log('Deleting table!')
            await projectRepo.removeTable(test_tableName);
            console.log('Table deleted?!')
        }
    });

    beforeEach(() => {
        createdEntry = new Project();
        createdEntry.name = 'Test Project';
        createdEntry.color = "red";
        createdEntry.accountId = "e13884dc-15fe-46f9-9ee4-8c5ccb3b9a0f";

        req.params = {
            id: createdEntry.id,
            userid: createdEntry.accountId
        };
        req.body = createdEntry;

        resJson = undefined;
        resSend = undefined;
    });

    it('should create a Project if it does not exist', async () =>{
        //Check if user does not exist
        await projectController.get(req, res);

        expect(resJson).toBeUndefined();
        expect(resSend).toBeInstanceOf(Error);

        resJson = undefined;
        resSend = undefined;
        console.log('going into upsert');
        await projectController.upsert(req, res);
        setTimeout(() => {
            console.log('into settimeout');

            expect(resSend).toBeUndefined();
            expect(resJson).not.toBeUndefined();
            console.log('resJson: ' + JSON.parse(resJson));
            let resObj = JSON.parse(resJson);
            expect(resObj.id).toBe(createdEntry.id);
              }, 1000);
    })
});