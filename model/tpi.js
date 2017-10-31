var helper = require('./database.js');
require ('./hubungan_tpi.js')

Model = helper.bookshelf.Model.extend({
  tableName: 'tpi',
  sesi: function() {
  	return this.hasMany('Sesi', 'tpi_id')
  },
  hubungan_tpi: function() {
  	return this.hasMany('HubunganTPI', 'tpi_id')
  }
});
model = helper.bookshelf.model('TPI', Model);

module.exports = {
  model
}
