var helper = require('./database.js');
require('./tpi')
require('./peserta')
require('./hasil_ikan')
require('./ikan')

Model = helper.bookshelf.Model.extend({
  tableName: 'sesi',
  tpi: function() {
  	return this.belongsTo('TPI', 'tpi_id')
  },
  pemenang: function() {
    return this.belongsTo('Peserta', 'pemenang_id')
  },
  ikan: function() {
    return this.belongsTo('Ikan', 'ikan_id')
  },
  hasil_ikan: function() {
    return this.belongsTo('HasilIkan', 'hasil_ikan_id')
  }
});
model = helper.bookshelf.model('Sesi', Model);

module.exports = {
  model
}
