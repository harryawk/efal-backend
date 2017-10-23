var helper = require('./database.js');

Model = helper.bookshelf.Model.extend({
  tableName: 'nelayan'
});
model = helper.bookshelf.model('Nelayan', Model);

module.exports = {
  model
}
