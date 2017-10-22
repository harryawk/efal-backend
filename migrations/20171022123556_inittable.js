
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('tpi', function(request, response){
      table.increments().unsigned()
      table.string('nama')
      table.string('telepon')
      table.string('email')
      table.string('url_gambar')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('tpi')
  ])
};
