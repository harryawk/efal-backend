var helper = require('./database.js');

Model = helper.bookshelf.Model.extend({
  tableName: 'hasil_ikan'
});
model = helper.bookshelf.model('HasilIkan', Model);

module.exports = {
  model
}
