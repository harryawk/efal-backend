module.exports = function (request, response) {

  var sesi = require('../../model/sesi')
  var admin = require('../../model/admin_tpi')
  var hasil_ikan = require('../../model/hasil_ikan')
  var ikan = require('../../model/ikan')
  var penawaran = require('../../model/penawaran')
  var peserta = require('../../model/peserta')
  var pendaftar = require('../../model/pendaftar')

  body = request.body
  console.log(body)

  if (!body['api_key']) {
    response.json({
      sukses: false,
      pesan: "API Key tidak ada"
    })
    return;
  }

  peserta.model.where({ api_key: body['api_key'] ? body['api_key'] : '' }).fetch().then(function (model) {
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

    sesi_id = body['id_sesi']
    peserta_id = body['id_peserta']
    harga_tawaran = body['harga']
    berat_kebutuhan = body['kebutuhan_ikan']

    penawaran.model.where({ sesi_id: sesi_id, peserta_id: peserta_id }).fetch().then(function(model) {
      // console.log(model)
      if (model) { // this means update only
        console.log('update only')
        penawaran.model.where({ sesi_id: sesi_id, peserta_id: peserta_id }).fetch().then(function (model) {
          if (model) {
            the_id = model.get('id')
            new penawaran.model({id: the_id}).save({
              sesi_id: sesi_id,
              peserta_id: peserta_id,
              harga_tawaran: harga_tawaran,
              berat_kebutuhan: berat_kebutuhan
            }).then(function(model) {
              if (model) {
                penawaran.model.where({ sesi_id: sesi_id, peserta_id: peserta_id }).fetch({ withRelated: ['sesi', 'peserta'] }).then(function (model) {
                  if (model) {
                    var result = model.toJSON()
                    result.status = 3 // TODO: Add checking topup
                    response.json(result)
                  } else {
                    response.json({
                      msg: "ERROR: Model is not found."
                    })
                  }
                }) // add catch - fetch penawaran
              } else {
                response.json({
                  msg: "ERROR: no update or no penawaran record found"
                })
              }
            }) // add catch - update penawaran
          } else {
            response.json({
              msg: "ERROR: This should never been happened"
            })
          }
        }) // add catch - fetch penawaran
      } else {
        console.log('create new record')
        pendaftar.model.where({ sesi_id: sesi_id, peserta_id: peserta_id }).fetch().then(function (model) {
          if (model) {
            new penawaran.model({
              sesi_id: sesi_id,
              peserta_id: peserta_id,
              harga_tawaran: harga_tawaran,
              berat_kebutuhan: berat_kebutuhan
            }).save().then(function(model) {
              penawaran.model.where({ sesi_id: sesi_id, peserta_id: peserta_id }).fetch({withRelated: ['sesi', 'peserta']}).then(function(model) {
                if (model) {
                  var result = model.toJSON()
                  result.status = 3
                  response.json(result)
                } else {
                  response.json({
                    msg: "ERROR: Model is not found."
                  })
                }
              }) // add catch - fetch penawaran
            }) // add catch - save penawaran
          } else {
            response.json({
              msg: "ERROR: Record anda tidak ditemukan. Harap daftar di sesi ini terlebih dahulu."
            })
          }
        }) // add catch - fetch pendaftar
      }
    }) // add catch - fetch penawaran
  })
    .catch(function (error) {
      console.log('Transaction failed')
      console.log(error)
      response.status(500).send("Error while retrieve admin: " + error)
    })
}