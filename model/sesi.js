var helper = require('./database.js');
require('./tpi')
require('./peserta')
require('./hasil_ikan')
require('./ikan')

Model = helper.bookshelf.Model.extend({
  tableName: 'sesi',
  tpi: function() {
  	return this.belongsTo('TPI', 'id')
  },
  pemenang: function() {
    return this.belongsTo('Peserta', 'id')
  },
  ikan: function() {
    return this.belongsTo('Ikan', 'id')
  },
  hasil_ikan: function() {
    return this.belongsTo('HasilIkan', 'id')
  }
});
model = helper.bookshelf.model('Sesi', Model);

module.exports = {
  model
}
