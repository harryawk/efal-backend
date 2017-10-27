module.exports = function(request, response) {

  var tpi = require('./model/tpi')

  tpi.model.fetchAll().then(function (model) {
    if (model) {
      response.json(model.toJSON())
    } else {
      response.json({
        error: "Error: Model is undefined"
      })
    }
  })
    .catch(function (err) {
      console.log(err)
      response.status(500).json({
        error: "Error: Cannot fetching TPI"
      })
    })
}