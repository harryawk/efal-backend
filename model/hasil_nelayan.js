var helper = require('./database.js');

Model = helper.bookshelf.Model.extend({
  tableName: 'hasil_nelayan',
  nelayan: function() {
    return this.belongsTo('Nelayan', 'id')
  },
  hasil_ikan: function() {
    return this.belongsTo('HasilIkan', 'id')
  }
});
model = helper.bookshelf.model('HasilNelayan', Model);

module.exports = {
  model
}
