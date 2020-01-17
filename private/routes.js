module.exports = function(app) {

  // User section
    const UserController = require('./controller/userController');
    var _userController = new UserController();

    app.route('/users')
      .post((req, res) => {
        _userController.upsert(req, res);
      });
      // .get(_userController.getAll)
  
    app.route('/users/:id')
      .get((req, res) => {
        _userController.get(req, res);
      })
      .delete((req, res) => {
        _userController.remove(req, res);
      });

  // Project section
    const ProjectController = require('./controller/projectController');
    var _projectController = new ProjectController();

    app.route('/users/:userid/projects')
      .get((req, res) => {
        _projectController.getAll(req, res);
      })
      .post((req, res) => {
        _projectController.upsert(req, res);
      });
  
    app.route('/users/:userid/users/:id')
      .get((req, res) => {
        _userController.get(req, res);
      })
      .delete((req, res) => {
        _userController.remove(req, res);
      });
  };