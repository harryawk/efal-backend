
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('admin', function (table) {
      table.string('email');
      table.string('nomor_telepon')
    })
  ])
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('admin', function (table) {
      table.dropColumn('email');
      table.dropColumn('nomor_telepon')
    })
  ])
};
