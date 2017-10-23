var helper = require('./database.js');

Model = helper.bookshelf.Model.extend({
  tableName: 'hubungan_tpi'
});
model = helper.bookshelf.model('HubunganTPI', Model);

module.exports = {
  model
}
