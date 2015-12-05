var app = require('./app');
var config = require('./config/');
var models = require('./app/models');

var port = process.env.PORT || config.port || 3000;

models.sequelize.sync({
  force: false 
}).then(function() {
  app.listen(port, function() {
    console.log('listening on port ' + port + '.');
  })
});
