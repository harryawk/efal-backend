
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('penawaran', function(table) {
  	table.increments().unsigned()
  	table.integer('sesi_id').unsigned()
  	table.foreign('sesi_id').references('id').inTable('sesi').onDelete('cascade')
  	table.bigInteger('harga_tawaran')
		
  	table.integer('peserta_id').unsigned()
  	table.foreign('peserta_id').references('id').inTable('peserta').onDelete('cascade')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('penawaran')
};
