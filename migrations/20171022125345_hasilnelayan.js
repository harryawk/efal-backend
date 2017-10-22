
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfExists('hasil_nelayan', function(table){
      table.increments().unsigned()
    })
  ])
};

exports.down = function(knex, Promise) {
  
};
