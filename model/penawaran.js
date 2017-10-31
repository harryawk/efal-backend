var helper = require('./database.js');
require('./peserta')
require('./sesi')

Model = helper.bookshelf.Model.extend({
  tableName: 'penawaran',
  peserta: function() {
    return this.belongsTo('Peserta', 'peserta_id')
  },
  sesi: function() {
    return this.belongsTo('Sesi', 'sesi_id')
  }
});
model = helper.bookshelf.model('Penawaran', Model);

module.exports = {
  model
}
