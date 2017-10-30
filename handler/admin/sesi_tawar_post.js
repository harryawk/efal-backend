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
    var nama_akun = body['nama_akun']
    var berat_kebutuhan = parseFloat(body['kebutuhan_ikan'])
    var harga_tawaran = parseInt(body['harga'])

    var peserta_id
    
    //TODO: Add comparing to socket.io ,

    peserta.model.where({nama_akun: nama_akun}).fetch().then(function(model) {
      if (model) {
        peserta_id = model.get('id')
        new penawaran.model({sesi_id: id, peserta_id: peserta_id, harga_tawaran: harga_tawaran, berat_kebutuhan: berat_kebutuhan}).save().then(function(model) {
          if (model) {
            response.json({
              sukses: true
            })
          } else [
            response.json({
              msg: "Cannot save Peserta"
            })
          ]
        }) // add catch - save model
      } else {
        response.json({
          msg: "ERROR: Akun not found"
        })
      }
    }) // add catch - fetch peserta with nama_akun
  })
    .catch(function (error) {
      console.log('Transaction failed')
      console.log(error)
      response.status(500).send("Error while retrieve admin: " + error)
    })
}