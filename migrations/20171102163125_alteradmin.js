
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('admin', function (table) {
      table.string('nama_lengkap');
    })
  ])
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('admin', function (table) {
      table.dropColumn('nama_lengkap');
    })
  ])
};
