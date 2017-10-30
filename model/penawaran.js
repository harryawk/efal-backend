var helper = require('./database.js');
require('./peserta')

Model = helper.bookshelf.Model.extend({
  tableName: 'penawaran',
  peserta: function() {
    return this.belongsTo('Peserta', 'id')
  }
});
model = helper.bookshelf.model('Penawaran', Model);

module.exports = {
  model
}
