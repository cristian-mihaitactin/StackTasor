var azure = require('azure-storage');
const TaskController = require('../../../controller/taskController');
const TaskRepository = require('../../../db/taskRepo');
const AzureTableRepository = require('../../../db/azureTableRepository');
const Task = require('../../../../models/db/task');

const test_tableName = 'TestTask';
const deleteTable = false;
const deleteCreatedEntries = true;

var azRepo = new AzureTableRepository(test_tableName);
setTimeout(() => {
}, 1000);
const  taskRepo= new TaskRepository(azRepo);
const  taskController = new TaskController(taskRepo);

var createdEntry = '';

describe('TaskController Integration', function () {
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
            await taskRepo.removeTable(test_tableName);
            console.log('Table deleted?!')
        }
    });

    beforeEach(() => {
        createdEntry = new Task();
        createdEntry.name = 'Test Task';
        createdEntry.color = "red";
        createdEntry.accountId = "242fd2e6-8d3c-4770-9e97-d5e24f050e61";
        createdEntry.projectId = "d126b458-ead1-4cfe-8303-4055b1b4fb86";

        createdEntry.decription = "decription";
        createdEntry.taskType = "taskType";
        createdEntry.estimation = "estimation";
        createdEntry.status = "status";
        createdEntry.geographicZone = "geographicZone";
        createdEntry.workDomain = "workDomain";
        createdEntry.attachedAccountId = "attachedAccountId";
        createdEntry.timeZone = "timeZone";
        createdEntry.linkToEvidence = "linkToEvidence";

        req.params = {
            id: createdEntry.id,
            userid: createdEntry.accountId,
            projectid: createdEntry.projectid
        };
        req.body = createdEntry;

        resJson = undefined;
        resSend = undefined;
    });

    it('should create a Task if it does not exist', async () =>{
        //Check if user does not exist
        await taskController.get(req, res);

        expect(resJson).toBeUndefined();
        expect(resSend).toBeInstanceOf(Error);

        resJson = undefined;
        resSend = undefined;
        console.log('going into upsert');
        await taskController.upsert(req, res);
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