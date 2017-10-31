module.exports = function (request, response) {
  tpiadmin = require('../../model/admin_tpi')
  tpi = require('../../model/tpi')
  sesi = require('../../model/sesi')

  body = request.query
  console.log(body)

  if (!body['api_key']) {
    response.status(403).json({
      msg: "No API Key"
    })
    return
  }

  tpiadmin.model.where({ api_key: body['api_key'] }).fetch().then(function (model) {
    if (model) {
      var tpi_id = model.get('tpi_id')
      sesi.model.where({ id: body['id_sesi'], tpi_id: tpi_id }).fetch({withRelated: ['ikan', 'pemenang', 'hasil_ikan']}).then(function (sesi_model) {
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