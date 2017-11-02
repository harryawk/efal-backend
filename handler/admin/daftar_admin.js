// Hashing helper
function sha256(input, secret) {
  var crypto = require('crypto')
  const hash = crypto.createHmac('sha256', secret)
    .update(input)
    .digest('hex');

  return hash;
}

module.exports = function (request, response) {
  var admin = require('../../model/admin_tpi')
  var tpi = require('../../model/tpi')

  var body = request.body
  console.log(body)

  var tpi_id
  tpi.model.where({ nama: body['nama_tpi'] }).fetch().then(function(model) {
    if (!model) {
      response.json({
        msg: "Theres no such TPI name"
      })
      return;
    }
    tpi_id = model.get('id')
    admin.model.where({ nama_akun: body['nama_akun'] }).fetch().then(function (model) {
      if (!model) {
        new admin.model({
          nik: body['nik'],
          nama_lengkap: body['nama_lengkap'],
          nama_akun: body['nama_akun'],
          nomor_telepon: body['nomor_telepon'],
          email: body['email'],
          tpi_id: tpi_id,
          password: sha256(body['password'], '12345'),
          api_key: sha256(body['nama_akun'], 'efal-backend'),
        }).save().then(function (model) {
          if (model) {
            response.json({
              sukses: true,
              api_key: model.get('api_key'),
              id_admin: model.get('id'),
              id_tpi: model.get('tpi_id'),
              pesan: "Berhasil"
            })
            return;
          } else {
            response.json({
              sukses: false,
              pesan: "Gagal menyimpan"
            })
          }
        }).catch(function (error) {
          console.log('Transaction failed')
          console.log(error)
          response.status(500).send("Error while saving: " + error)
        })
      } else {
        response.json({
          sukses: false,
          pesan: "Nama akun sudah ada"
        })
      }
    }) // add catch - fetch admin with nama_akun
  }) // add catch - fetch tpi according name
}