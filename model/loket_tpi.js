var helper = require('./database.js');

Model = helper.bookshelf.Model.extend({
  tableName: 'loket'
});
model = helper.bookshelf.model('Loket', Model);

module.exports = {
  model
}
