var azure = require('azure-storage');
const UserRepository = require('../../private/db/userRepo');
const AzureTableRepository = require('../../private/db/azureTableRepository');
const User = require('../../models/db/user');
const entGen = azure.TableUtilities.entityGenerator;

const latestUserVersion = 'user-v1';

describe('UserRepository', function () {
    var azRepo;
    var userRepo;

    describe('Moq', function () {
        var tableStorageMoq; // azurestorage.services.table.TableService();
        beforeEach(function () {
            tableStorageMoq = new azure.TableService();
            spyOn(tableStorageMoq, 'createTableIfNotExists').and.callFake(function (tableName) {
                tableCreated = true;
                return {error: false, result: '', response: ''};
            });

            azRepo = new AzureTableRepository('MoqTable', tableStorageMoq);
            userRepo = new UserRepository(azRepo);
        });

        it('should transform User Entity to User DbModel', function () {
            var model = new User();
            model.accountType = 'Annonimous';
            model.username = 'test_user';
            model.password = 'test_pass';
            model.email = 'test@abc.com';

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

            // Act
            var response = userRepo.entityToModel(entity);

            // have the same id

            expect(response).toEqual(model);
        })

        it('should transform User DbModel to User Entity', function () {
            var model = new User();
            model.accountType = 'Annonimous';
            model.username = 'test_user';
            model.password = 'test_pass';
            model.email = 'test@abc.com';

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

            // Act
            var response = userRepo.modelToEntity(model);

            expect(response).toEqual(entity);
        })
    });
});
