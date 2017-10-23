var helper = require('./database.js');

Model = helper.bookshelf.Model.extend({
  tableName: 'penawaran'
});
model = helper.bookshelf.model('Penawaran', Model);

module.exports = {
  model
}
