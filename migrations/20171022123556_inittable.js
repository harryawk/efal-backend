
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTableIfNotExists('ikan', function(table) {
      table.increments().unsigned()
      table.string('jenis_ikan')
      table.string('url_gambar')
    }),

    knex.schema.createTableIfNotExists('tpi', function(table){
      table.increments().unsigned()
      table.string('nama')
      table.string('telepon')
      table.string('email')
      table.string('alamat')
      table.string('url_gambar')
      table.time('jam_buka')
      table.time('jam_tutup')
    }),
    
    knex.schema.createTableIfNotExists('nelayan', function(table) {
      table.increments().unsigned()
      table.string('nik')
      table.string('nama_lengkap')
      table.string('nama_akun')
      table.string('nomor_telepon')
      table.string('password')
      table.string('api_key')
    }),

    knex.schema.createTableIfNotExists('hasil_ikan', function(table){
      table.increments().unsigned()
      table.integer('ikan_id').unsigned()
      table.foreign('ikan_id').references('id').inTable('ikan').onUpdate('restrict').onDelete('cascade')
      table.integer('tpi_id').unsigned()
      table.foreign('tpi_id').references('id').inTable('tpi').onUpdate('restrict').onDelete('cascade')
      table.decimal('berat_total', 15, 2)
      table.date('tanggal')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('hasil_ikan'),
    knex.schema.dropTableIfExists('nelayan'),
    knex.schema.dropTableIfExists('tpi'),
    knex.schema.dropTableIfExists('ikan'),
  ])
};
