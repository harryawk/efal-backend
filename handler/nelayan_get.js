module.exports = function (request, response) {

  var nelayan = require('../model/nelayan')

  var body = request.query

  nelayan.model.where({id: body['id_nelayan']}).fetch().then(function (model) {
    response.json(model.toJSON())
  })

}