module.exports = function (request, response) {
  var tpiadmin = require('../../model/admin_tpi')
  var tpi = require('../../model/tpi')
  var sesi = require('../../model/sesi')
  var peserta = require('../../model/peserta')
  var pendaftar = require('../../model/pendaftar')
  var moment = require('moment')
  var _ = require('lodash')

  var body = request.query
  console.log(body)

  if (!body['api_key']) {
    response.status(403).json({
      msg: "No API Key"
    })
    return
  }

  var peserta_id = body['id_peserta']
  var tanggal_sesi = moment(body['tanggal']).format('YYYY-MM-DD')
  var sesis = []

  peserta.model.where({ id: peserta_id, api_key: body['api_key'] }).fetch().then(function (model) {
    if (model) {
      if (model.toJSON() == {}) {
        response.json({
          msg: "ERROR: Invalid Credentials"
        })
        return;
      }

      sesi.model.where({tanggal_sesi: tanggal_sesi}).fetchAll().then(function(model) {
        if (model) {
          sesis = model.toJSON()

          var sesi_ids = []
          for (var i = 0; i < sesis.length; i++) {
            sesi_ids.push(sesis[i].id)
          }

          pendaftar.model.where('sesi_id', 'in', sesi_ids).fetchAll().then(function(model) {
            if (model) {
              var pendaftar_result = model.toJSON()
              // console.log(pendaftar_result)
              // response.send('Remove id_that_not_exists after this')
              var result = sesis
              _.remove(result, function (elem) {
                return !(_.some(pendaftar_result, { sesi_id: elem.id }))
              })
              console.log('========= result ===========')
              console.log(result)
              response.json({
                daftar_sesi: result
              })
            } else {
              response.json({
                msg: "ERROR: Pendaftar Model is undefined"
              })
            }
          })
        } else {
          response.json({
            msg: "ERROR: Sesi Model is undefined"
          })
        }
      })
    } else {
      response.json({
        msg: "ERROR: Peserta Model is undefined"
      })
      return;
    }
  }).catch(function (error) {
    console.log('Fetching failed')
    console.log(error)
    response.status(500).send("Cannot fetch admin: " + error)
  })
}