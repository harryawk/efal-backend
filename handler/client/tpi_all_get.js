module.exports = function (request, response) {
  var peserta = require('../../model/peserta')
  var tpi = require('../../model/tpi')

  var body = request.query
  console.log(body)
  
  if (!body['api_key']) {
      response.status(403).json({
          msg: "No API Key"
      })
  } else {
      peserta.model.where({api_key: body['api_key']}).fetch().then(function (model) {
          if (!model && body['api_key'] != 'umum') {
              response.json({
                  msg: "Something is wrong with your API Key. Your data is not here. Contact the administrator."
              })
              return;
          }

          tpi.model.fetchAll().then(function (tpi_list) {
              response.json({
                  daftar: tpi_list
              })
          }).catch(function(err) {
              console.log('Fetching failed')
              console.log(err)
              response.status(500).send("Cannot retrieve TPI: " + err)                
          })
      }).catch(function(err) {
          console.log('Fetching failed')
          console.log(err)
          response.status(500).send("Cannot validate peserta: " + err)
      })
  }
}