
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.table('penawaran', function (table) {
			table.integer('berat_dapat');
		})
	])
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.table('penawaran', function (table) {
			table.dropColumn('berat_dapat');
		})
	])
};
