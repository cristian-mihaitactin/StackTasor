var azure = require('azure-storage');
const UserController = require('../../../controller/userController');
const UserRepository = require('../../../db/userRepo');
const AzureTableRepository = require('../../../db/azureTableRepository');
const User = require('../../../../models/db/user');

const test_tableName = 'TestUser';
const deleteTable = true;
const deleteCreatedEntries = true;

var azRepo = new AzureTableRepository(test_tableName);
setTimeout(() => {
}, 1000);
const  userRepo= new UserRepository(azRepo);
const  userController = new UserController(userRepo);

var createdEntry = '';

describe('UserController Integration', function () {
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
            await userRepo.removeTable(test_tableName);
            console.log('Table deleted?!')

        }
    });

    beforeEach(() => {
        createdEntry = new User();
        createdEntry.accountType = 0;
        createdEntry.email = "test.user@userController.com";
        createdEntry.username = "test.user";
        createdEntry.password = "olaTest";

        req.params = {
            id: createdEntry.id
        };
        req.body = createdEntry;

        resJson = undefined;
        resSend = undefined;
    });

    it('should create an User if it does not exist', async () =>{
        //Check if user does not exist
        await userController.get(req, res);

        expect(resJson).toBeUndefined();
        expect(resSend).toBeInstanceOf(Error);

        resJson = undefined;
        resSend = undefined;
        await userController.upsert(req, res);
        setTimeout(() => {
            expect(resSend).toBeUndefined();
            expect(resJson).not.toBeUndefined();
            let resObj = JSON.parse(resJson);
            expect(resObj.id).toBe(createdEntry.id);
              }, 1000);
    })

    
});