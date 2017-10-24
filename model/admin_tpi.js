var helper = require('./database.js');

Model = helper.bookshelf.Model.extend({
  tableName: 'admin'
});
model = helper.bookshelf.model('Admin', Model);

module.exports = {
  model
}
