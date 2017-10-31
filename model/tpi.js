var helper = require('./database.js');
require ('./hubungan_tpi.js')
require('./sesi')

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

model.where({id: 1}).fetchAll({withRelated: ['sesi']}).then(function(model) {console.log(model.toJSON())})

module.exports = {
  model
}
