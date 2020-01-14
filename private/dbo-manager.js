var azure = require('azure-storage');

var blobService = azure.createBlobService();
blobService.createContainerIfNotExists(
  'taskcontainer',
  {
    publicAccessLevel: 'blob'
  },
  function(error, result, response) {
    if (!error) {
      // if result = true, container was created.
      // if result = false, container already existed.
    }
  }
);
