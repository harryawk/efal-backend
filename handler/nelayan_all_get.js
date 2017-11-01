module.exports = function(request, response) {

  var nelayan = require('../model/nelayan')

  nelayan.model.fetchAll().then(function(model) {
    response.json({
      daftar_nelayan: model.toJSON()
    })
  })
  
}