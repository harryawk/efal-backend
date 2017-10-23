
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('tpi', function(table){
      table.increments().unsigned()
      table.string('nama')
      table.string('telepon')
      table.string('email')
      table.string('alamat')
      table.string('url_gambar')
    }),
    
    knex.schema.createTableIfNotExists('nelayan', function(table) {
      table.increments().unsigned()
      table.string('nik')
      table.string('nama_lengkap')
      table.string('nama_akun')
      table.string('nomor_telepon')
    }),

    knex.schema.createTableIfNotExists('hasil_ikan', function(table){
      table.increments().unsigned()
      table.string('jenis_ikan')
      table.decimal('berat_total')
      table.string('url_gambar')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('tpi'),
    knex.schema.dropTableIfExists('nelayan'),
    knex.schema.dropTableIfExists('hasil_ikan')
  ])
};
