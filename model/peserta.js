var helper = require('./database.js');

Model = helper.bookshelf.Model.extend({
  tableName: 'peserta'
});
model = helper.bookshelf.model('Peserta', Model);

module.exports = {
  model
}
