module.exports = function(app) {
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
  };