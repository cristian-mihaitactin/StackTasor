module.exports = function(app) {

  // User section
    const UserController = require('./controller/userController');
    var _userController = new UserController();

    app.route('/users')
      .post((req, res) => {
        _userController.upsert(req, res);
      })
      .get((req, res) => {
        _userController.getQuery(req, res);
      });
  
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
        _projectController.getByUserId(req, res);
      })
      .post((req, res) => {
        _projectController.upsert(req, res);
      });

    app.route('/users/:userid/projects/:id')
      .get((req, res) => {
        _projectController.get(req, res);
      })
      .delete((req, res) => {
        _projectController.remove(req, res);
      });

      // Task section
    const TaskController = require('./controller/taskController');
    var _taskController = new TaskController();

    app.route('/users/:userid/projects/:projectid/tasks/')
    . get((req, res) => {
      _taskController.getByProjectId(req, res);
    });

    app.route('/users/:userid/projects/:projectid/tasks/:id')
    .delete((req, res) => {
      _taskController.remove(req, res);
    });

    app.route('/projects/:projectid/tasks')
      .post((req, res) => {
        _taskController.upsert(req, res);
      });
  
      app.route('/projects/:projectid/tasks/:id')
      .get((req, res) => {
        _taskController.get(req, res);
      })
      .delete((req, res) => {
        _taskController.remove(req, res);
      });
  };