module.exports = function (request, response) {

  var hasil_ikan = require('./model/hasil_ikan')
  var tpiadmin = require('./model/admin_tpi')

  var body = request.query
  if (!body['api_key']) {
    response.status(403).json({
      msg: "No API Key"
    })
  } else {

    var tpi_id = parseInt(body['id_tpi'])
    var tanggal = moment(body['tanggal']).format('YYYY-MM-DD')

    tpiadmin.model.where({ api_key: body['api_key'] ? body['api_key'] : '' }).fetch().then(function (model) {
      if (model) {
        // API Key Checking
        if (model.toJSON() == {}) {
          response.json({
            msg: "Invalid Credentials"
          })
          return;
        }
        if (parseInt(model.get('tpi_id')) != tpi_id) {
          response.json({
            msg: "Invalid Credentials"
          })
          return;
        }
      } else {
        response.json({
          msg: "Something is wrong with your API Key. Your data is not here. Contact the administrator."
        })
        return;
      }

      hasil_ikan.model.where({ tpi_id: tpi_id, tanggal: tanggal }).fetchAll().then(function (model) {
        if (model) {
          var result = model.toJSON()
          for (var i = 0; i < result.length; i++) {
            delete result[i].tpi_id

            result[i].total_berat = result[i].berat_total
            delete result[i].berat_total

            result[i].gambar = result[i].url_gambar
            delete result[i].url_gambar
          }

          response.json({
            total_hasil: result
          })
        } else {
          response.json({
            msg: "Your requested data is not here. Contact the administrator."
          })
          return;
        }
      }) // add catch - fetch related hasil_ikan
        .catch(function (err) {
          console.log('Transaction failed')
          console.log(err)
          response.status(500).send("Cannot fetch hasil_ikan: " + err)
        })
    }) // add catch - fetch apikeys
      .catch(function (err) {
        console.log('Fetching failed')
        console.log(err)
        response.status(500).send("Cannot validate admin: " + err)
      })
  }
}