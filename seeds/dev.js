
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
  var _ = require('lodash')

  console.log(config.db_client)

  var ikan_ikan = [
    'udang dogol',
    'layang deles',
    'tongkol abu-abu',
    'siro',
    'tuna mata besar',
    'cakalang',
    'madidihang',
    'layang',
    'kakap',
    'teri',
    'tembang',
    'japuh',
    'kakap merah',
    'swanggi',
    'kurisi',
    'kuniran',
    'tenggiri batang',
    'tetengkek',
    'peperek topang',
    'layang benggol',
    'tongkol pisang-balaki',
    'udang krosok',
    'udang jambret',
    'ikan lidah',
    'kembung lelaki',
    'paralolosi',
    'anggola',
    'peperek',
    'udang jerbung',
    'bilis',
    'layur',
    'bawal putih'
  ]

  var tasks = [
    knex('hubungan_tpi').del().then(function (c) { 
      // console.log(c)
      console.log('delete hubungan_tpi') 
      return knex('penawaran').del().then(function (c) { 
        console.log('delete penawaran') 
        return knex('pendaftar').del().then(function (c) { 
          console.log('delete pendaftar') 
          return knex('sesi').del().then(function (c) { 
            console.log('delete sesi') 
            return knex('peserta').del().then(function (c) { 
              console.log('delete peserta') 
              return knex('admin').del().then(function (c) { 
                console.log('delete admin') 
                return knex('loket').del().then(function (c) { 
                  console.log('delete loket') 
                  return knex('hasil_nelayan').del().then(function (c) { 
                    console.log('delete hasil_nelayan') 
                    return knex('hasil_ikan').del().then(function (c) { 
                      console.log('delete hasil_ikan') 
                      return knex('nelayan').del().then(function (c) { 
                        console.log('delete nelayan') 
                        return knex('tpi').del().then(function (c) { 
                          console.log('delete tpi') 
                          return knex('ikan').del().then(function (c) { 
                            console.log('delete ikan') 
                            return knex.raw(config.db_client == 'postgresql' ? 'ALTER SEQUENCE hubungan_tpi_id_seq RESTART WITH 1' : 'ALTER TABLE hubungan_tpi AUTO_INCREMENT = 1').then(function (c) { 
                              console.log('reset auto_increment hubungan_tpi')
                              return knex.raw(config.db_client == 'postgresql' ? 'ALTER SEQUENCE penawaran_id_seq RESTART WITH 1' : 'ALTER TABLE penawaran AUTO_INCREMENT = 1').then(function (c) { 
                                console.log('reset auto_increment penawaran') 
                                return knex.raw(config.db_client == 'postgresql' ? 'ALTER SEQUENCE pendaftar_id_seq RESTART WITH 1' : 'ALTER TABLE pendaftar AUTO_INCREMENT = 1').then(function (c) { 
                                  console.log('reset auto_increment pendaftar') 
                                  return knex.raw(config.db_client == 'postgresql' ? 'ALTER SEQUENCE sesi_id_seq RESTART WITH 1' : 'ALTER TABLE sesi AUTO_INCREMENT = 1').then(function (c) { 
                                    console.log('reset auto_increment sesi') 
                                    return knex.raw(config.db_client == 'postgresql' ? 'ALTER SEQUENCE peserta_id_seq RESTART WITH 1' : 'ALTER TABLE peserta AUTO_INCREMENT = 1').then(function (c) { 
                                      console.log('reset auto_increment peserta') 
                                      return knex.raw(config.db_client == 'postgresql' ? 'ALTER SEQUENCE admin_id_seq RESTART WITH 1' : 'ALTER TABLE admin AUTO_INCREMENT = 1').then(function (c) { 
                                        console.log('reset auto_increment admin')
                                        return knex.raw(config.db_client == 'postgresql' ? 'ALTER SEQUENCE loket_id_seq RESTART WITH 1' : 'ALTER TABLE loket AUTO_INCREMENT = 1').then(function (c) { 
                                          console.log('reset auto_increment loket') 
                                          return knex.raw(config.db_client == 'postgresql' ? 'ALTER SEQUENCE hasil_nelayan_id_seq RESTART WITH 1' : 'ALTER TABLE hasil_nelayan AUTO_INCREMENT = 1').then(function (c) { 
                                            console.log('reset auto_increment hasil_nelayan') 
                                            return knex.raw(config.db_client == 'postgresql' ? 'ALTER SEQUENCE hasil_ikan_id_seq RESTART WITH 1' : 'ALTER TABLE hasil_ikan AUTO_INCREMENT = 1').then(function (c) { 
                                              console.log('reset auto_increment hasil_ikan') 
                                              return knex.raw(config.db_client == 'postgresql' ? 'ALTER SEQUENCE nelayan_id_seq RESTART WITH 1' : 'ALTER TABLE nelayan AUTO_INCREMENT = 1').then(function (c) { 
                                                console.log('reset auto_increment nelayan') 
                                                return knex.raw(config.db_client == 'postgresql' ? 'ALTER SEQUENCE tpi_id_seq RESTART WITH 1' : 'ALTER TABLE tpi AUTO_INCREMENT = 1').then(function (c) { 
                                                  console.log('reset auto_increment tpi') 
                                                  return knex.raw(config.db_client == 'postgresql' ? 'ALTER SEQUENCE ikan_id_seq RESTART WITH 1' : 'ALTER TABLE ikan AUTO_INCREMENT = 1').then(function (c) { 
                                                    console.log('reset auto_increment ikan') 
                                                    var table_ikan = []
                                                    _.map(ikan_ikan, function(ikan) {
                                                      table_ikan.push({
                                                        jenis_ikan: ikan,
                                                        url_gambar: "https://lorempixel.com/640/480/animals/"
                                                      })
                                                    })
                                                    return knex('ikan').insert(table_ikan).then(function(c) {
                                                      console.log('insert record ikan')
                                                      var table_tpi = []
                                                      for (var i = 1; i <= 10; i++) {
                                                        table_tpi.push({
                                                            id: i,
                                                            nama: faker.name.findName(),
                                                            telepon: chance.phone(),
                                                            email: faker.internet.email(),
                                                            alamat: faker.address.streetAddress(),
                                                            url_gambar: "https://lorempixel.com/640/480/animals/"
                                                        })
                                                      }
                                                      return knex('tpi').insert(table_tpi).then(function(c) {
                                                        console.log('insert record TPI')
                                                        var table_admin = []
                                                        for (var i = 1; i <= 10; i++) {
                                                          for (var j = 1; j <= 4; j++) {
                                                            user_name = faker.internet.userName() + '_admin' + i.toString() + j.toString()
                                                            table_admin.push({
                                                              tpi_id: i,
                                                              password: sha256('123456', '12345'),
                                                              nama: faker.name.findName(),
                                                              nama_akun: user_name,
                                                              nik: chance.natural(),
                                                              api_key: sha256(user_name, 'efal-backend')
                                                            })
                                                          }
                                                        }

                                                        return knex('admin').insert(table_admin).then(function(c) {
                                                          console.log('insert record Admin')
                                                          var table_nelayan = []
                                                          for (var i = 1; i <= 10; i++) {
                                                            user_name = faker.internet.userName() + '_nelayan' + i.toString()
                                                            table_nelayan.push({
                                                              id: i,
                                                              nik: chance.natural(),
                                                              nama_lengkap: faker.name.findName(),
                                                              nama_akun: user_name,
                                                              nomor_telepon: chance.phone(),
                                                              password: sha256('123456', '12345'),
                                                              api_key: sha256(user_name, 'efal-backend')
                                                            })
                                                          }

                                                          return knex('nelayan').insert(table_nelayan).then(function(c) {
                                                            console.log('insert table Nelayan')
                                                            var table_peserta = []

                                                            for (var i = 1; i <= 10; i++) {
                                                              user_name = faker.internet.userName()
                                                              table_peserta.push({
                                                                id: i,
                                                                nik: chance.natural(),
                                                                nama_lengkap: faker.name.findName(),
                                                                nama_akun: user_name,
                                                                nomor_telepon: chance.phone(),
                                                                email: faker.internet.email(),
                                                                password: sha256('123456', '12345'),
                                                                api_key: sha256(user_name, 'efal-backend')
                                                              })
                                                            }

                                                            return knex('peserta').insert(table_peserta).then(function(c) {
                                                              console.log('insert table peserta')

                                                              var table_hasil_ikan = []
                                                              var table_hasil_nelayan = []

                                                              var y = 0
                                                              for (var i = 1; i <= 10; i++) {
                                                                for (var j = 1; j <= 10; j++) {
                                                                  var x = i - 1
                                                                  var the_berat = random(100, 400)
                                                                  var the_url_gambar = faker.image.imageUrl()
                                                                  var the_date = moment().add(j, 'days').minute(0).hour(0).second(0).format('YYYY-MM-DD')
                                                                  table_hasil_ikan.push({
                                                                      berat_total: the_berat,
                                                                      ikan_id: i,
                                                                      tpi_id: j,
                                                                      tanggal: the_date
                                                                    })
                                                                  y++;
                                                                  console.log('Insert HasilNelayan')
                                                                  table_hasil_nelayan.push({
                                                                      id: y,
                                                                      tpi_id: i,
                                                                      nelayan_id: j,
                                                                      hasil_ikan_id: y,
                                                                      ikan_id: i,
                                                                      berat: the_berat,
                                                                      tanggal: the_date
                                                                    })
                                                                }
                                                              }

                                                              return knex('hasil_ikan').insert(table_hasil_ikan).then(function(c) {
                                                                console.log('insert table hasil_ikan')
                                                                return knex('hasil_nelayan').insert(table_hasil_nelayan).then(function(c) {
                                                                  console.log('insert hasil_nelayan')
                                                                  
                                                                })
                                                              })
                                                            })
                                                          })
                                                        })
                                                      })
                                                    })
                                                  })
                                                })
                                              })
                                            })
                                          })
                                        })
                                      })
                                    })
                                  })
                                })
                              })
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    }),
    
  ]
  
  

  // Insert HasilIkan
  // console.log('Insert HasilIkan')
  
  

  // return Promise.each(tasks, function (t) {
  return Promise.all(tasks
    //doing all the task
  )
};
