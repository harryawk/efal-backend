var helper = require('./database.js');

Model = helper.bookshelf.Model.extend({
  tableName: 'hasil_nelayan'
});
model = helper.bookshelf.model('HasilNelayan', Model);

module.exports = {
  model
}
