module.exports = function (request, response) {

  var sesi = require('../../model/sesi')
  var admin = require('../../model/admin_tpi')
  var hasil_ikan = require('../../model/hasil_ikan')
  var ikan = require('../../model/ikan')
  var penawaran = require('../../model/penawaran')
  var peserta = require('../../model/peserta')

  body = request.body
  console.log(body)

  if (!body['api_key']) {
    response.json({
      sukses: false,
      pesan: "API Key tidak ada"
    })
    return;
  }

  admin.model.where({ api_key: body['api_key'] ? body['api_key'] : '' }).fetch().then(function (model) {
    if (model) {
      // API Key Checking
      if (model.toJSON() == {}) {
        response.json({
          msg: "Invalid Credentials"
        })
        return;
      }
    } else {
      response.json({
        msg: "Something is wrong with your API Key. Your data is not here. Contact the administrator."
      })
      return;
    }

    var id = body['id_sesi']
    
    var tpi_id = body['id_tpi']
    var nama_akun = body['nama_akun']
    var jumlah_sesi = body['jumlah_sesi']
    var daftar_sesi = body['daftar_sesi']
    var jumlah_uang_komitmen = body['jumlah_uang_komitmen']

    var peserta_id

    peserta.model.where({nama_akun: nama_akun}).fetch().then(function(model) {
      if (model) {
        peserta_id = model.get('id')
        saved_models = []
        for (var x = 0; x < daftar_sesi.length; x++) {
          saved_models.push({
            peserta_id: peserta_id,
            sesi_id: daftar_sesi[x]
          })
        }
        penawaran.model.collection(saved_models).invokeThen('save').then(function(model) {
          console.log('done')
          response.json({
            sukses: true
          })
        })
      } else {
        response.json({
          msg: "ERROR: Peserta Model is undefined"
        })
      }
    })

  })
    .catch(function (error) {
      console.log('Transaction failed')
      console.log(error)
      response.status(500).send("Error while retrieve admin: " + error)
    })
}