var helper = require('./database.js');

Model = helper.bookshelf.Model.extend({
  tableName: 'hubungan_tpi',
  tpi_terhubung: function() {
  	return this.belongsTo('TPI', 'tpi_terhubung_id')
  }
});
model = helper.bookshelf.model('HubunganTPI', Model);

module.exports = {
  model
}
