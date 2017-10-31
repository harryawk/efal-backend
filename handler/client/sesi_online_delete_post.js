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
    
    var pendaftar_id

    penawaran.model.where({ peserta_id: body['id_peserta'], sesi_id: body['id_sesi'] }).fetch().then(function (model) {
      if (model) {
        if (model.toJSON() == {}) {
          response.json({
            msg: "There is no such sesi"
          })
          return
        }

        response.json({
          sukses: false,
          pesan: "Anda telah melakukan penawaran pada sesi ini"
        })
      } else {
        console.log('Penawaran not found')
        pendaftar.model.where({ peserta_id: body['id_peserta'], sesi_id: body['id_sesi'] }).fetch().then(function(model) {
          if (model) {
            pendaftar_id = model.get('id')
            new pendaftar.model({id: pendaftar_id}).destroy().then(function(model) {
              response.json({
                sukses: true
              })
            })
          } else {
            response.json({
              msg: "You have not registered yet"
            })
          }
        }) /// add catch - fetch pendaftar
      }
    }) // add catch - fetch penawaran

  })
    .catch(function (error) {
      console.log('Transaction failed')
      console.log(error)
      response.status(500).send("Error while retrieve admin: " + error)
    })
}