module.exports = function(request, response) {
  var tpi = require('../../model/tpi')
  var sesi = require('../../model/sesi')
  var hasil_nelayan = require('../../model/hasil_nelayan')
  var moment = require('moment')

  var body = request.query
  console.log(body)

  if (!body['api_key']) {
    response.status(403).json({
      msg: "No API Key"
    })
    return
  }

  tpi.model.where({id: body['id_tpi']}).fetch({withRelated: ['hubungan_tpi.tpi_terhubung']}).then(function (tpi_model) {
    var date = moment().subtract(1, 'days').format('YYYY-MM-DD')
    sesi.model.where({tpi_id: body['id_tpi'], status: 3, tanggal_sesi: date}).fetchAll({withRelated: ['ikan']}).then(function (model) {
      if(model) {
        hasil_nelayan.model.where({tpi_id: body['id_tpi'], tanggal: date}).count().then(function (jumlah_nelayan) {
          
          var total_harga = 0

          for(var i=0; i<model.length; i++) {
            total_harga += model.at(i).get('akhir_harga')
          }

          response.json({
            tpi: tpi_model,
            tpi_terhubung: null,
            hasil_lelang: model,
            jumlah_nelayan: jumlah_nelayan,
            jumlah_sesi: model.length,
            total_harga: total_harga
          })
        })
      } else {
        response.json({
          message: "No sesi retrieved"
        })
      }
    }).catch(function (err) {
      console.log(err)
      response.status(500).json({
        error: "Error: cannot fetching TPI 1"
      })      
    })
  }).catch(function (err) {
    console.log(err)
    response.status(500).json({
      error: "Error: cannot fetching TPI 2"
    })
  })
}
