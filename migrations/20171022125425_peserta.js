
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('peserta', function (table) {
  	table.increments().unsigned()
  	table.string('nik', 16)
  	table.string('nama lengkap')
  	table.string('nama_akun')
  	table.string('nomor_telepon')
  	table.string('email')
  	table.string('password')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('peserta')
};
