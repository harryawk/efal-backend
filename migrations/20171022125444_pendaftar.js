
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('pendaftar', function (table) {
  	table.increments().unsigned()
  	table.integer('sesi_id').unsigned()
  	table.foreign('sesi_id').references('id').inTable('sesi').onUpdate('restrict').onDelete('cascade')
		
  	table.integer('peserta_id').unsigned()
  	table.foreign('peserta_id').references('id').inTable('peserta').onUpdate('restrict').onDelete('cascade')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('pendaftar')
};
