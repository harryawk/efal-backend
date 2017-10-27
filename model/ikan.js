var helper = require('./database.js');

Model = helper.bookshelf.Model.extend({
  tableName: 'ikan'
});
model = helper.bookshelf.model('Ikan', Model);

module.exports = {
  model
}
