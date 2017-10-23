var helper = require('./database.js');

Model = helper.bookshelf.Model.extend({
  tableName: 'sesi'
});
model = helper.bookshelf.model('Sesi', Model);

module.exports = {
  model
}
