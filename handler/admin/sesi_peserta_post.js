module.exports = function (request, response) {

  var sesi = require('../../model/sesi')
  var admin = require('../../model/admin_tpi')
  var hasil_ikan = require('../../model/hasil_ikan')
  var ikan = require('../../model/ikan')
  var penawaran = require('../../model/penawaran')

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
    console.log(id)
    
    penawaran.model.where({sesi_id: id}).fetchAll({withRelated: ['peserta']}).then(function(model) {
      console.log(model.toJSON())
      if (model) {
        result = []
        for (var x = 0; x < model.toJSON().length; x++) {
          result.push(model.toJSON()[x].peserta.nama_akun)
        }
        response.json({daftar_peserta: result})
      } else {
        response.json({
          msg: "ERROR: Model is undefined"
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