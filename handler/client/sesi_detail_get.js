module.exports = function (request, response) {
  var peserta = require('../../model/peserta')
  var tpi = require('../../model/tpi')
  var sesi = require('../../model/sesi')
  var moment = require('moment')
  var penawaran = require('../../model/penawaran')
  var pendaftar = require('../../model/pendaftar')

  var body = request.query
  console.log(body)
  if (!body['api_key']) {
    response.status(403).json({
      msg: "No API Key"
    })
  } else {
    peserta.model.where({ api_key: body['api_key'] }).fetch().then(function (model) {
      if (!model) {
        response.json({
          msg: "Something is wrong with your API Key. Your data is not here. Contact the administrator."
        })
        return;
      }

      sesi.model.where({id: body['id_sesi']}).fetch({withRelated: ['ikan']}).then(function (model) {

        penawaran
        if (!model) {
          response.json({
            msg: "Tidak ada sesi pada tanggal tersebut"
          })
          return;                
        }
        response.json({
          sesi: model,
          menang: 
        })
      }).catch(function(err) {
        console.log('Fetching failed')
        console.log(err)
        response.status(500).send("Cannot validate peserta: " + err)
      })

    }).catch(function (err) {
      console.log('Fetching failed')
      console.log(err)
      response.status(500).send("Cannot validate peserta: " + err)
    })
  }
}