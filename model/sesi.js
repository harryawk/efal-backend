var helper = require('./database.js');

Model = helper.bookshelf.Model.extend({
  tableName: 'sesi',
  tpi: function() {
  	return this.belongsTo('TPI', 'id')
  }
});
model = helper.bookshelf.model('Sesi', Model);

module.exports = {
  model
}
