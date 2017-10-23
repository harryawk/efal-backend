var helper = require('./database.js');

Model = helper.bookshelf.Model.extend({
  tableName: 'pendaftar'
});
model = helper.bookshelf.model('Pendaftar', Model);

module.exports = {
  model
}
