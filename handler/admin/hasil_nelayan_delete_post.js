module.exports = function(request, response) {

  var hasil_ikan = require('../../model/hasil_ikan')
  var nelayan = require('../../model/nelayan')
  var tpiadmin = require('../../model/admin_tpi')
  var hasil_nelayan = require('../../model/hasil_nelayan')

  var body = request.body
  if (!body['api_key']) {
    response.status(403).json({
      msg: "No API Key"
    })
  } else {

    var hasil_nelayan_id = body['id_hasil'] //TODO: findout ini id_hasil apa? nelayan atau ikan

    tpiadmin.model.where({ api_key: body['api_key'] ? body['api_key'] : '' }).fetch().then(function (model) {
      if (model) {
        // API Key Checking
        if (model.toJSON() == {}) {
          response.json({
            msg: "Invalid Credentials"
          })
          return
        }
      } else {
        response.json({
          msg: "Something is wrong with your API Key. Your data is not here. Contact the administrator."
        })
        return;
      }
      var the_model
      new hasil_nelayan.model({ id: hasil_nelayan_id }).destroy().then(function (model) {
        if (model) {
          the_model = model.toJSON()
          console.log(the_model)
          hasil_nelayan.helper.bookshelf.knex.raw('ALTER TABLE hasil_nelayan AUTO_INCREMENT = 1').then(function (c) { 
            console.log('reset auto_increment hasil_nelayan') 
            response.json({
              "sukses": true
            })
          })
          .catch(function(err) {
            new hasil_nelayan.model(the_model).save().then(function(model) {
              response.json({
                msg: "ERROR: Cannot reset auto_increment in table hasil_nelayan"
              })
            })
          })
        } else {
          response.status(500).json({
            errMessage: "Fail to destroy requested hasil_nelayan"
          })
        }
      }) // add catch - destroy nelayan
      .catch(function(err) {
        new hasil_nelayan.model(the_model).save().then(function(model) {
          response.json({
            msg: "ERROR: Cannot reset auto_increment in table hasil_nelayan"
          })
        })
      })
    }) // add catch - fetch apikeys
  }
}