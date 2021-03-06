
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('hubungan_tpi', function(table) {
      table.increments().unsigned()
      
      table.integer('tpi_id').unsigned()
      table.foreign('tpi_id').references('id').inTable('tpi').onDelete('cascade')
      
      table.integer('tpi_terhubung_id').unsigned()
      table.foreign('tpi_terhubung_id').references('id').inTable('tpi').onDelete('cascade')

      table.decimal('jarak')
    })
  ])
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('hubungan_tpi')  
};
