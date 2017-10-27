module.exports = function (request, response) {

  var hasil_ikan = require('./model/hasil_ikan')
  var nelayan = require('./model/nelayan')
  var tpiadmin = require('./model/admin_tpi')
  var hasil_nelayan = require('./model/hasil_nelayan')
  var ikan = require('./model/ikan')

  var body = request.body
  if (!body['api_key']) {
    response.status(403).json({
      msg: "No API Key"
    })
    return;
  } else {

    var hasil_nelayan_id = body['id_hasil']
    var nama_akun = body['akun_nelayan']
    var ikan = body['jenis_ikan']
    var berat = body['berat']
    var url_gambar = body['gambar']

    var nelayan_id
    var ikan_id

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


      var berat_lama_nelayan
      var berat_lama_hasil_ikan
      var hasil_ikan_id
      hasil_nelayan.model.where({id: hasil_nelayan_id}).fetch({withRelated: ['hasil_ikan']}).then(function(model) {
        if (model) {
          berat_lama_nelayan = parseFloat(model.get('berat'))
          hasil_ikan_id = parseInt(model.get('hasil_ikan_id'))
          berat_lama_hasil_ikan = parseFloat(model.toJSON()['hasil_ikan']['berat_total'])
          nelayan.model.where({nama_akun: nama_akun}).fetch().then(function(model) {
            if (model) {
              nelayan_id = model.get('id')
              ikan.model.where({jenis_ikan: jenis_ikan}).fetch().then(function(model) {
                if (model) {
                  ikan_id = model.get('id')
                  var the_berat_hasil_ikan = berat_lama_hasil_ikan
                  new hasil_ikan.model({id: hasil_ikan_id}).save({

                  }, {patch: true})
                } else {
                  response.json({
                    msg: "ERROR: Ikan not found"
                  })
                  return;
                }
              })
            } else {
              response.json({
                msg: "ERROR: Nelayan not found"
              })
              return;
            }
          })
        } else {
          response.json({
            msg: "ERROR: Cannot fetch hasil_nelayan_id with id = " + hasil_nelayan_id
          })
          return
        }
      })

      // nelayan.model.where({ nama_akun: nama_akun }).fetch().then(function (model) {
      //   nelayan_id = model.get('id')
      //   console.log(nelayan_id)

        // hasil_ikan.model.where({jenis_ikan: jenis_ikan}).fetch().then(function(model) {
        //     hasil_ikan_id = model.get('id')
        //     console.log(hasil_ikan_id)

        //     console.log('----------------------')

        //     var berat_sekarang = parseFloat(model.get('berat_total'))
        //     berat_sekarang += parseFloat(berat)

        //     // Update hasil_ikan berat
        //     new hasil_ikan.model({
        //         id: hasil_ikan_id
        //     }).save({
        //         berat_total: berat_sekarang
        //     }, {patch: true})
        //     .then(function(model) {

        //         // Add new record to hasil_nelayan
        //         new hasil_nelayan.model({
        //             tpi_id: tpi_id,
        //             berat: berat,
        //             url_gambar: url_gambar,
        //             nelayan_id: nelayan_id,
        //             hasil_ikan_id: hasil_ikan_id,
        //             tanggal: tanggal
        //         }).save().then(function(model) {

        //             console.log(tpi_id)
        //             console.log(nama_akun)
        //             console.log(berat)
        //             console.log(url_gambar)
        //             console.log(nelayan_id)
        //             console.log(hasil_ikan_id)
        //             console.log(tanggal)

        //             console.log('new berat')
        //             console.log(berat_sekarang)

        //             response.json({
        //                 sukses: true
        //             })
        //         }) // add catch - Add new record to hasil_nelayan
        //         .catch(function(err) {
        //             console.log('Rollback transaction')
        //             berat_sekarang -= berat
        //             new hasil_ikan.model({id: hasil_ikan_id})
        //                 .save({berat_total: berat_sekarang}, {patch: true})
        //                 .then(function(model) {
        //                     response.status(500).json({
        //                         msg: "Error saving hasil_nelayan model. " + err
        //                     })
        //                 })
        //         })

        //     }) // add catch - Update hasil_ikan berat
        //     .catch(function(err) {
        //         console.log('Transaction failed')
        //         response.status(500).send("Update hasil_nelayan failed")
        //     })

        // }) // add catch - fetch hasil_ikan


      // }) // add catch - fetch nelayan

    }) // add catch - fetch apikeys
  }
}