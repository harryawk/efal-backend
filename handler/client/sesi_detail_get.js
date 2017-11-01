module.exports = function (request, response) {
  var peserta = require('../../model/peserta')
  var tpi = require('../../model/tpi')
  var sesi = require('../../model/sesi')
  var moment = require('moment')
  var penawaran = require('../../model/penawaran')
  var pendaftar = require('../../model/pendaftar')

  var body = request.query
  console.log(body)
  if (!body['api_key']) {
    response.status(403).json({
      msg: "No API Key"
    })
  } else {
    peserta.model.where({ api_key: body['api_key'] }).fetch().then(function (peserta_model) {
      if (!model && body['api_key'] != 'umum') {
        response.json({
          msg: "Something is wrong with your API Key. Your data is not here. Contact the administrator."
        })
        return;
      }

      sesi.model.where({id: body['id_sesi']}).fetch({withRelated: ['ikan']}).then(function (sesi_model) {
        if (sesi_model.get('status') == 3) {
            pendaftar.model.where({peserta_id: peserta_model.get('id'), sesi_id: sesi_model.get('id')}).fetch()
            .then(function (pendaftar_model) {
              if(pendaftar_model) {
                penawaran.model.where({sesi_id: sesi_model.get('id')}).fetchAll().then(function (penawaran_model) {
                  var penawaran_user = penawaran_model.where({peserta_id: peserta_model.get('id')})
                  var berat_sisa = sesi_model.get('berat')

                  for(var i=0; i<penawaran_model.length; i++){
                    berat_sisa -=penawaran_model.at(i).get('berat_kebutuhan')
                  }

                  if(berat_sisa<0) {
                    berat_sisa = 0
                  }

                  console.log(penawaran_model)
                  if (penawaran_user.length == 0) {
                    response.json({
                      sesi: sesi_model,
                      terdaftar: true,
                      menang: false,
                      daftar_penawar: penawaran_model,
                      berat_sisa: berat_sisa
                    })                    
                  }
                  else if (penawaran_user[0].get('kode_kemenangan') != null) {
                    response.json({
                      sesi: sesi_model,
                      terdaftar: true,
                      menang: true,
                      kode_kemenangan: penawaran_user[0].get('kode_kemenangan'),
                      hasil_kemenangan: penawaran_user,
                      daftar_penawar: penawaran_model,
                      berat_sisa: berat_sisa
                    })                    
                  } else {
                    response.json({
                      sesi: sesi_model,
                      terdaftar: true,
                      menang: false,
                      daftar_penawar: penawaran_model,
                      berat_sisa: berat_sisa
                    })                                        
                  }
                })                
              } else {
                  response.json({
                    sesi: sesi_model,
                    terdaftar: false,
                    daftar_penawar: penawaran_model
                  })                
                }
          })
        } else {
          penawaran.model.where({peserta_id: peserta_model.get('id')}).fetchAll().then(function (penawaran_model) {
            if (!model) {
              response.json({
                msg: "Tidak ada sesi pada tanggal tersebut"
              })
              return;
            }
            response.json({
              sesi: sesi_model,
              terdaftar: false,
              daftar_penawar: penawaran_model
            })
          })
        }
      }).catch(function(err) {
        console.log('Fetching failed')
        console.log(err)
        response.status(500).send("Cannot validate peserta: " + err)
      })

    }).catch(function (err) {
      console.log('Fetching failed')
      console.log(err)
      response.status(500).send("Cannot validate peserta: " + err)
    })
  }
}