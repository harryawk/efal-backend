
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('admin', function(table) {
      table.increments().unsigned()
      table.string('nama')
      table.string('nik')
      table.string('nama_akun')
      table.string('password')
      table.integer('tpi_id').unsigned()
      table.foreign('tpi_id').references('id').inTable('tpi').onUpdate('restrict').onDelete('cascade')
      table.string('api_key')
    }),
    knex.schema.createTableIfNotExists('loket', function(table) {
      table.increments().unsigned()
      table.string('nama')
      table.string('nik')
      table.string('nama_akun')
      table.string('password')
      table.integer('tpi_id').unsigned()
      table.foreign('tpi_id').references('id').inTable('tpi').onUpdate('restrict').onDelete('cascade')
      table.string('api_key')
    }),
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('admin'),
    knex.schema.dropTableIfExists('loket')
  ])
};
