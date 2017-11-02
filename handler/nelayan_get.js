module.exports = function (request, response) {

  var nelayan = require('../model/nelayan')

  var body = request.query

  console.log(body)

  nelayan.model.where({tpi_id: body['id_tpi']}).fetch().then(function (model) {
    response.json(model.toJSON())
  })

}