module.exports = function(request, response) {
  
  var sesi = require('../../model/sesi')
  var admin = require('../../model/admin_tpi')
  var hasil_ikan = require('../../model/hasil_ikan')
  var ikan = require('../../model/ikan')

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
      }
      return;
    } else {
      response.json({
        msg: "Something is wrong with your API Key. Your data is not here. Contact the administrator."
      })
      return;
    }

    var sesi_id = body['id_sesi']
    var mulai_harga = body['mulai_harga']
    var jam_mulai = body['jam_mulai']
    var jam_selesai = body['jam_selesai']
    var ikan_id
    var hasil_ikan_id

    sesi.model.where({ id: sesi_id }).then(function(model) {
      if (model) {
        ikan.model.where({ jenis_ikan: jenis_ikan }).then(function(model) {
          ikan_id = model.get('id')
          new sesi.model({
            id: sesi_id
          }).save({mulai_harga: mulai_harga, jam_mulai: jam_mulai, 
                  jam_selesai: jam_selesai, ikan_id: ikan_id
          }, {patch: true}).then(function(model) {
            response.json({
              sukses: true
            })
          }) // add catch - update sesi
        }) // add catch - ikan_id
      } else {
        response.json({
          msg: "ERROR: Model is undefined"
        })
      }
    }) // add catch
  })
  .catch(function (error) {
    console.log('Transaction failed')
    console.log(error)
    response.status(500).send("Error while retrieve admin: " + error)
  })
}