
// Hashing helper
function sha256(input, secret) {
  var crypto = require('crypto')
  const hash = crypto.createHmac('sha256', secret)
    .update(input)
    .digest('hex');

  return hash;
}

// Key Generator helper
function generateKey() {
  var sha = crypto.createHash('sha256');
  sha.update(Math.random().toString());
  var final_sha_digest = sha.digest('hex');
  return final_sha_digest;
}

// Random number helper
function random(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

exports.seed = function(knex, Promise) {
  var faker = require('faker');
  var Chance = require('chance');
  var chance = new Chance(1);
  var moment = require('moment');
  var config = require('../config');

  console.log(config.db_client)

  var ikan_ikan = ["cakalang", "kuweh", "layang deles", "teri", "kembung", "kurisi", "swanggi", "lencam", "tongkol banyar", "udang dogol"]

  var tasks = [
    knex('hubungan_tpi').del().then(function (c) { console.log('delete hubungan_tpi') }),
    knex('penawaran').del().then(function (c) { console.log('delete penawaran') }),
    knex('pendaftar').del().then(function (c) { console.log('delete pendaftar') }),
    knex('sesi').del().then(function (c) { console.log('delete sesi') }),
    knex('peserta').del().then(function (c) { console.log('delete peserta') }),
    knex('admin').del().then(function (c) { console.log('delete admin') }),
    knex('loket').del().then(function (c) { console.log('delete loket') }),
    knex('hasil_nelayan').del().then(function (c) { console.log('delete hasil_nelayan') }),
    knex('hasil_ikan').del().then(function (c) { console.log('delete hasil_ikan') }),
    knex('nelayan').del().then(function (c) { console.log('delete nelayan') }),
    knex('tpi').del().then(function (c) { console.log('delete tpi') }),
    knex.raw(config.db_client == 'postgresql' ? 'ALTER SEQUENCE hubungan_tpi_id_seq RESTART WITH 1' : 'ALTER TABLE hubungan_tpi AUTO_INCREMENT = 1').then(function (c) { console.log('reset auto_increment hubungan_tpi') }),
    knex.raw(config.db_client == 'postgresql' ? 'ALTER SEQUENCE penawaran_id_seq RESTART WITH 1' : 'ALTER TABLE penawaran AUTO_INCREMENT = 1').then(function (c) { console.log('reset auto_increment penawaran') }),
    knex.raw(config.db_client == 'postgresql' ? 'ALTER SEQUENCE pendaftar_id_seq RESTART WITH 1' : 'ALTER TABLE pendaftar AUTO_INCREMENT = 1').then(function (c) { console.log('reset auto_increment pendaftar') }),
    knex.raw(config.db_client == 'postgresql' ? 'ALTER SEQUENCE sesi_id_seq RESTART WITH 1' : 'ALTER TABLE sesi AUTO_INCREMENT = 1').then(function (c) { console.log('reset auto_increment sesi') }),
    knex.raw(config.db_client == 'postgresql' ? 'ALTER SEQUENCE peserta_id_seq RESTART WITH 1' : 'ALTER TABLE peserta AUTO_INCREMENT = 1').then(function (c) { console.log('reset auto_increment peserta') }),
    knex.raw(config.db_client == 'postgresql' ? 'ALTER SEQUENCE admin_id_seq RESTART WITH 1' : 'ALTER TABLE admin AUTO_INCREMENT = 1').then(function (c) { console.log('reset auto_increment admin') }),
    knex.raw(config.db_client == 'postgresql' ? 'ALTER SEQUENCE loket_id_seq RESTART WITH 1' : 'ALTER TABLE loket AUTO_INCREMENT = 1').then(function (c) { console.log('reset auto_increment loket') }),
    knex.raw(config.db_client == 'postgresql' ? 'ALTER SEQUENCE hasil_nelayan_id_seq RESTART WITH 1' : 'ALTER TABLE hasil_nelayan AUTO_INCREMENT = 1').then(function (c) { console.log('reset auto_increment hasil_nelayan') }),
    knex.raw(config.db_client == 'postgresql' ? 'ALTER SEQUENCE hasil_ikan_id_seq RESTART WITH 1' : 'ALTER TABLE hasil_ikan AUTO_INCREMENT = 1').then(function (c) { console.log('reset auto_increment hasil_ikan') }),
    knex.raw(config.db_client == 'postgresql' ? 'ALTER SEQUENCE nelayan_id_seq RESTART WITH 1' : 'ALTER TABLE nelayan AUTO_INCREMENT = 1').then(function (c) { console.log('reset auto_increment nelayan') }),
    knex.raw(config.db_client == 'postgresql' ? 'ALTER SEQUENCE tpi_id_seq RESTART WITH 1' : 'ALTER TABLE tpi AUTO_INCREMENT = 1').then(function (c) { console.log('reset auto_increment tpi') }),
  ]
  
  // pre-defined before auction even started

  // Insert TPI
  console.log('Insert TPI')
  for (var i = 1; i <= 10; i++) {
    tasks.push(
      knex('tpi').insert({
        id: i,
        nama: faker.name.findName(),
        telepon: chance.phone(),
        email: faker.internet.email(),
        alamat: faker.address.streetAddress(),
        // url_gambar: faker.image.animals()
        url_gambar: "http://lorempixel.com/640/480/animals/"
      })
    )
  }

  // Insert Admin
  console.log('Insert Admin')
  for (var i = 1; i <= 10; i++) {
    for (var j = 1; j <= 4; j++) {
      user_name = faker.internet.userName() + '_admin' + i.toString() + j.toString()
      tasks.push(
        knex('admin').insert({
          tpi_id: i,
          password: sha256('123456', '12345'),
          nama: faker.name.findName(),
          nama_akun: user_name,
          nik: chance.natural(),
          api_key: sha256(user_name, 'efal-backend')
        })
      )
    }
  }
  
  // Insert Loket
  console.log('Insert Loket')
  for (var i = 1; i <= 10; i++) {
    for (var j = 1; j <= 4; j++) {
      user_name = faker.internet.userName() + '_loket' + i.toString() + j.toString()
      tasks.push(
        knex('loket').insert({
          tpi_id: i,
          password: sha256('123456', '12345'),
          nama: faker.name.findName(),
          nama_akun: user_name,
          nik: chance.natural(),
          api_key: sha256(user_name, 'efal-backend')
        })
      )
    }
  }

  // Insert Nelayan
  console.log('Insert Nelayan')
  for (var i = 1; i <= 10; i++) {
    user_name = faker.internet.userName() + '_nelayan' + i.toString()
    tasks.push(
      knex('nelayan').insert({
        id: i,
        nik: chance.natural(),
        nama_lengkap: faker.name.findName(),
        nama_akun: user_name,
        nomor_telepon: chance.phone(),
        password: sha256('123456', '12345'),
        api_key: sha256(user_name, 'efal-backend')
      })
    )
  }

  // Insert Peserta
  console.log('Insert Peserta')
  for (var i = 1; i <= 10; i++) {
    user_name = faker.internet.userName()
    tasks.push(
      knex('peserta').insert({
        id: i,
        nik: chance.natural(),
        nama_lengkap: faker.name.findName(),
        nama_akun: user_name,
        nomor_telepon: chance.phone(),
        email: faker.internet.email(),
        password: sha256('123456', '12345'),
        api_key: sha256(user_name, 'efal-backend')
      })
    )
  }

  // Insert HasilIkan
  console.log('Insert HasilIkan')
  var y = 0
  for (var i = 1; i <= 10; i++) {
    for (var j = 1; j <= 10; j++) {
      var x = i - 1
      var the_berat = random(100, 400)
      var the_url_gambar = faker.image.imageUrl()
      var the_date = moment().add(j, 'days').minute(0).hour(0).second(0).format('YYYY-MM-DD')
      tasks.push(
        knex('hasil_ikan').insert({
          jenis_ikan: ikan_ikan[x],
          berat_total: the_berat,
          url_gambar: the_url_gambar,
          tpi_id: j,
          tanggal: the_date
        })
      )
      y++;
      console.log('Insert HasilNelayan')
      tasks.push(
        knex('hasil_nelayan').insert({
          id: y,
          tpi_id: i,
          nelayan_id: j,
          hasil_ikan_id: y,
          berat: the_berat,
          url_gambar: the_url_gambar,
          tanggal: the_date
        })
      )
    }
  }

  console.log('Insert HasilNelayan')
  for (var i = 1; i <= 10; i++) {
    for (var j = 1; j <= 10; j++) {
      var x = i - 1
    }
  }
  
  // return Promise.each(tasks, function (t) {
  return Promise.all(tasks
    //doing all the task
  )
};
