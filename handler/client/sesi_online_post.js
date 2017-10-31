module.exports = function (request, response) {

  var sesi = require('../../model/sesi')
  var ikan = require('../../model/ikan')
  var penawaran = require('../../model/penawaran')
  var peserta = require('../../model/peserta')
  var pendaftar = require('../../model/pendaftar')
  var moment = require('moment')

  body = request.body
  console.log(body)

  if (!body['api_key']) {
    response.json({
      sukses: false,
      pesan: "API Key tidak ada"
    })
    return;
  }

  peserta.model.where({ id: body['id_peserta'], api_key: body['api_key'] ? body['api_key'] : '' }).fetch().then(function (model) {
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
    
    var tanggal_sesi = moment("2017-10-30T13:00:34.121Z").format('YYYY-MM-DD')
    var jam_mulai = moment("2017-10-30T07:00:00.121Z").format('YYYY-MM-DD HH:mm:ss')
    var jam_selesai = moment("2017-10-30T10:00:00.121Z").format('YYYY-MM-DD HH:mm:ss')

    sesi.model.where({id: id, tanggal_sesi: tanggal_sesi }).fetch().then(function(model) {
      if (model) {
        if (model.toJSON() == {}) {
          response.json({
            msg: "There is no such sesi"
          })
          return
        }

        new pendaftar.model({ sesi_id: model.get('id'), peserta_id: body['id_peserta']}).save().then(function(model) {
          response.json({
            sukses: true,
            id_sesi: id,
            pesan: 1
          })
        })
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