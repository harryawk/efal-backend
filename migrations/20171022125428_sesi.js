
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('sesi', table => {
      table.increments().unsigned()
      table.decimal('berat', 15, 2)
      table.integer('hasil_ikan_id').unsigned()
      table.foreign('hasil_ikan_id').references('id').inTable('hasil_ikan').onUpdate('restrict').onDelete('cascade')
      table.integer('pemenang_id').unsigned()
      table.foreign('pemenang_id').references('id').inTable('peserta').onUpdate('restrict').onDelete('cascade')
      table.string('jenis_ikan')
      table.datetime('jam_mulai')
      table.datetime('jam_selesai')
      table.date('tanggal_sesi')
      table.integer('mulai_harga').unsigned()
      table.integer('akhir_harga').unsigned()
      table.string('kode_kemenangan')
      table.integer('status').unsigned()
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    // knex.schema.alterTable('sesi', function (table) {
    //   table.dropForeign('hasil_ikan_id')
    //   table.dropForeign('pemenang_id')
    // }),
    knex.schema.dropTableIfExists('sesi')
  ])
};
