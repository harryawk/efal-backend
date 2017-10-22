
exports.up = function(knex, Promise) {
  knex.schema.createTableIfNotExists('penawaran', function(table) {
  	table.increments().unsigned()
  	table.integer('sesi_id').unsigned()
  	table.integer('peserta_id').unsigned()
  	table.bigInteger('harga_tawaran')

  	table.foreign('sesi_id').references('id').inTable('sesi').onDelete('cascade')
  	table.foreign('peserta_id').references('id').inTable('peserta').onDelete('cascade')
  })
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('penawaran)')
};
