
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('hasil_nelayan', function(table){
      table.increments().unsigned()
      table.integer('tpi_id').unsigned()
      table.foreign('tpi_id').references('id').inTable('tpi').onUpdate('restrict').onDelete('cascade')
      table.integer('nelayan_id').unsigned()
      table.foreign('nelayan_id').references('id').inTable('nelayan').onUpdate('restrict').onDelete('cascade')
      table.integer('hasil_ikan_id').unsigned()
      table.foreign('hasil_ikan_id').references('id').inTable('hasil_ikan').onUpdate('restrict').onDelete('cascade')
      table.decimal('berat', 15, 2)
      table.string('url_gambar')
      table.date('tanggal')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    // knex.schema.alterTable('hasil_nelayan', function(table) {
    //   table.dropForeign('hasil_ikan_id')
    //   table.dropForeign('nelayan_id')
    //   table.dropForeign('tpi_id')
    // }),
    knex.schema.dropTableIfExists('hasil_nelayan')
  ])
};
