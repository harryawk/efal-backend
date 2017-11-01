module.exports = function (request, response) {
  var peserta = require('../../model/peserta')
  var tpi = require('../../model/tpi')
  var sesi = require('../../model/sesi')
  var moment = require('moment')

  var body = request.query
  console.log(body)
  if (!body['api_key']) {
    response.status(403).json({
      msg: "No API Key"
    })
  } else {
    peserta.model.where({ api_key: body['api_key'] }).fetch().then(function (model) {
      if (!model && body['api_key'] != 'umum') {
        response.json({
          msg: "Something is wrong with your API Key. Your data is not here. Contact the administrator."
        })
        return;
      }

      var tanggal = moment(body['tanggal']).format('YYYY-MM-DD')

      sesi.model.where({tpi_id: body['id_tpi'], status: 2}).fetchAll({withRelated: ['ikan']}).then(function (model) {
        if (!model) {
          response.json({
            msg: "Tidak ada sesi pada tanggal tersebut"
          })
          return;                
        }
        response.json({
          daftar_sesi: model,
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