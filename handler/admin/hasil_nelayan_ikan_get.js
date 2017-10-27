module.exports = function (request, response) {

  var hasil_ikan = require('./model/hasil_ikan')
  var nelayan = require('./model/nelayan')
  var tpiadmin = require('./model/admin_tpi')
  var hasil_nelayan = require('./model/hasil_nelayan')

  var body = request.query
  if (!body['api_key']) {
    response.status(403).json({
      msg: "No API Key"
    })
    return;
  } else {

    var tpi_id = body['id_tpi']
    var hasil_ikan_id = body['id_ikan']
    var tanggal = body['tanggal']

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

      hasil_nelayan.model.where({ tpi_id: tpi_id, hasil_ikan_id: hasil_ikan_id, tanggal: tanggal })
        .fetchAll({ withRelated: ['nelayan', 'hasil_ikan'] }).then(function (model) {
          var result = model.toJSON()

          console.log(result)
          for (var i = 0; i < result.length; i++) {

            result[i].id_hasil = result[i].tpi_id
            delete result[i].tpi_id

            result[i].gambar = result[i].url_gambar
            delete result[i].url_gambar

            result[i].akun_nelayan = result[i].nelayan.nama_akun
            delete result[i].nelayan
            delete result[i].nelayan_id

            result[i].jenis_ikan = result[i].hasil_ikan.jenis_ikan
            delete result[i].hasil_ikan
            delete result[i].hasil_ikan_id

          }

          response.json({
            daftar_nelayan: result
          })
        }) // add catch - fetch all hasil_nelayan with given params
        .catch(function (err) {
          console.log('Transaction failed')
          console.log(err)
          response.status(500).send("Cannot fetch hasil_nelayan: " + err)
        })

    }) // add catch - fetch apikeys
  }
}