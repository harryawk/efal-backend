module.exports = function (request, response) {
  var tpiadmin = require('../../model/admin_tpi')
  var tpi = require('../../model/tpi')
  var sesi = require('../../model/sesi')
  var moment = require('moment')

  var body = request.query
  console.log(body)

  if (!body['api_key']) {
    response.status(403).json({
      msg: "No API Key"
    })
    return
  }

  var tanggal_sesi = moment(body['tanggal']).format('YYYY-MM-DD')

  tpiadmin.model.where({ api_key: body['api_key'] }).fetch().then(function (model) {
    if (model) {
      var tpi_id = model.get('tpi_id')
      sesi.model.where({ tpi_id: tpi_id, tanggal_sesi: tanggal_sesi }).fetchAll({ withRelated: ['ikan', 'pemenang', 'hasil_ikan'] }).then(function (sesi_model) {
        response.json(sesi_model.toJSON())
        return
      }).catch(function (error) {
        console.log('Fetching failed')
        console.log(error)
        response.status(500).send("Cannot fetch admin: " + error)
      })
    } else {
      response.json({
        msg: "Invalid Credentials"
      })
      return;
    }
  }).catch(function (error) {
    console.log('Fetching failed')
    console.log(error)
    response.status(500).send("Cannot fetch admin: " + error)
  })
}