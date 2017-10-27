var helper = require('./database.js');

Model = helper.bookshelf.Model.extend({
  tableName: 'tpi',
  sesi: function() {
  	return this.hasMany('Sesi', 'tpi_id')
  }
});
model = helper.bookshelf.model('TPI', Model);

module.exports = {
  model
}
