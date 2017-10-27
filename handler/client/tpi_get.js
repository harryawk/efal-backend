module.exports = function(request, response) {
  var tpi = require('../../model/tpi')
  var sesi = require('../../model/sesi')

  var body = request.body
  console.log(body)

  tpi.model.where({id: body['id_tpi']}).fetch().then(function (tpi_model) {
    sesi.model.where({tpi_id: body['id_tpi']}).orderBy('start_date','DSC')
  }).catch(function (err) {
    console.log(err)
    response.status(500).json({
      error: "Error: cannot fetching TPI"
    })
  })

  tpi.model.fetchAll().then(function (model) {
    if (model) {
      response.json(model.toJSON())
    } else {
      response.json({
        error: "Error: Model is undefined"
      })
    }
  }).catch(function (err) {
    console.log(err)
    response.status(500).json({
      error: "Error: Cannot fetching TPI"
    })
  })
}
