var helper = require('./database.js');

Model = helper.bookshelf.Model.extend({
  tableName: 'tpi'
});
model = helper.bookshelf.model('TPI', Model);

module.exports = {
  model
}
