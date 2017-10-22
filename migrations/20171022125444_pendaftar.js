
exports.up = function(knex, Promise) {
  knex.schema.createTableIfNotExists('pendaftar', function (table) {
  	table.increments().unsigend()
  	table.integer('sesi_id')
  	table.integer('peserta_id')

  	table.foreign('sesi_id').references('id').inTable('sesi').onDelete('cascade')
  	table.foreign('peserta_id').references('id').inTable('peserta').onDelete('cascade')
  })
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('pendaftar')
};
