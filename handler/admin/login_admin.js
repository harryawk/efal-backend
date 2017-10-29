// Hashing helper
function sha256(input, secret) {
  var crypto = require('crypto')
  const hash = crypto.createHmac('sha256', secret)
    .update(input)
    .digest('hex');

  return hash;
}

module.exports = function (request, response) {
  var admin = require('../../model/admin')

  var body = request.body
  console.log(body)

  var password = sha256(body['password'], '12345')

  admin.model.where({ nama_akun: body['nama_akun'] }).fetch().then(function (model) {
    if (model) {
      if (model.get('password') == password) {
        response.json({
          sukses: true,
          api_key: model.get('api_key'),
          id_admin: model.get('id'),
          pesan: "Berhasil"
        })
        return;
      } else {
        response.json({
          sukses: false,
          pesan: "Password salah"
        })
        return;
      }
    } else {
      response.json({
        sukses: false,
        pesan: "Nama akun tidak terdaftar"
      })
      return;
    }
  }).catch(function (err) {
    console.log('Fetching failed')
    console.log(err)
    response.status(500).send("Cannot validate admin: " + err)
  })
}