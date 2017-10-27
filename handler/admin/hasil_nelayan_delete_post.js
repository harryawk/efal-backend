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
        }
      } else {
        response.json({
          msg: "Something is wrong with your API Key. Your data is not here. Contact the administrator."
        })
        return;
      }
      hasil_nelayan.model({ id: hasil_nelayan_id }).destroy().then(function (model) {
        if (model) {
          response.json({
            "sukses": true
          })
        } else {
          response.status(500).json({
            errMessage: "Fail to destroy requested hasil_nelayan"
          })
        }
      }) // add catch - destroy nelayan
    }) // add catch - fetch apikeys
  }
}