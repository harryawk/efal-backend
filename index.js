var express = require('express');

var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var moment = require('moment');
var config = require('./config');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration
// type_actor
        // 0 - Nelayan
        // 1 - Peserta
        // 2 - Loket
        // 3 - Admin

app.set('port', (process.env.PORT || 5000));

app.get('/', function (request, response) {
    var x = require('./model/database.js')
    response.send('Hello World Success')
});

app.get('/tpi', function(request, response) {

    var tpi = require('./model/tpi')

    tpi.model.fetchAll().then(function(model) {
        if (model) {
            response.json(model.toJSON())
        } else {
            response.json({
                error: "Error: Model is undefined"
            })
        }
    })
    .catch(function(err) {
        console.log(err)
        response.status(500).json({
            error: "Error: Cannot fetching TPI"
        })
    })
})

app.post('/hasil/nelayan', function(request, response) {

    var hasil_nelayan = require('./model/hasil_nelayan')
    var nelayan = require('./model/nelayan')
    var hasil_ikan = require('./model/hasil_ikan')
    var tpiadmin = require('./model/admin_tpi')

    var body = request.body
    if (!body['api_key']) {
        response.status(403).json({
            msg: "No API Key"
        })
    } else {

        var tpi_id = body['id_tpi']
        var nama_akun = body['akun_nelayan']
        var jenis_ikan = body['jenis_ikan']
        var berat = body['berat']
        var url_gambar = body['gambar']
        var tanggal = moment().locale('id').format('YYYY-MM-DD HH:mm:ss')
        
        var nelayan_id
        var hasil_ikan_id
        
        tpiadmin.model.where({api_key: body['api_key'] ? body['api_key'] : ''}).fetch().then(function(model) {
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
            nelayan.model.where({nama_akun: nama_akun}).fetch().then(function(model) {
                nelayan_id = model.get('id')
                console.log(nelayan_id)
                
                hasil_ikan.model.where({jenis_ikan: jenis_ikan}).fetch().then(function(model) {
                    hasil_ikan_id = model.get('id')
                    console.log(hasil_ikan_id)
        
                    console.log('----------------------')
        
                    var berat_sekarang = parseFloat(model.get('berat_total'))
                    berat_sekarang += parseFloat(berat)
        
                    // Update hasil_ikan berat
                    new hasil_ikan.model({
                        id: hasil_ikan_id
                    }).save({
                        berat_total: berat_sekarang
                    }, {patch: true})
                    .then(function(model) {
                        
                        // Add new record to hasil_nelayan
                        new hasil_nelayan.model({
                            tpi_id: tpi_id,
                            berat: berat,
                            url_gambar: url_gambar,
                            nelayan_id: nelayan_id,
                            hasil_ikan_id: hasil_ikan_id,
                            tanggal: tanggal
                        }).save().then(function(model) {
        
                            console.log(tpi_id)
                            console.log(nama_akun)
                            console.log(berat)
                            console.log(url_gambar)
                            console.log(nelayan_id)
                            console.log(hasil_ikan_id)
                            console.log(tanggal)
        
                            console.log('new berat')
                            console.log(berat_sekarang)
        
                            response.json({
                                sukses: true
                            })
                        }) // add catch - Add new record to hasil_nelayan
                        .catch(function(err) {
                            console.log('Rollback transaction')
                            berat_sekarang -= berat
                            new hasil_ikan.model({id: hasil_ikan_id})
                                .save({berat_total: berat_sekarang}, {patch: true})
                                .then(function(model) {
                                    response.status(500).json({
                                        msg: "Error saving hasil_nelayan model. " + err
                                    })
                                })
                        })
                    
                    }) // add catch - Update hasil_ikan berat
                    .catch(function(err) {
                        console.log('Transaction failed')
                        response.status(500).send("Update hasil_nelayan failed")
                    })
        
                }) // add catch - fetch hasil_ikan
        
                
            }) // add catch - fetch nelayan

        }) // add catch - fetch apikeys
    }
})

app.get('/hasil/total', function(request, response) {

    var hasil_ikan = require('./model/hasil_ikan')
    var tpiadmin = require('./model/admin_tpi')



    var body = request.query
    console.log(body)
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

            hasil_ikan.model.where({tpi_id: tpi_id, tanggal: tanggal}).fetchAll().then(function(model) {
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
            .catch(function(err) {
                console.log('Transaction failed')
                console.log(err)
                response.status(500).send("Cannot fetch hasil_ikan: " + err)
            })
        }) // add catch - fetch apikeys
        .catch(function(err) {
            console.log('Fetching failed')
            console.log(err)
            response.status(500).send("Cannot validate admin: " + err)
        })
    }
})


// Hashing helper
function sha256(input, secret) {
  var crypto = require('crypto')
  const hash = crypto.createHmac('sha256', secret)
    .update(input)
    .digest('hex');

  return hash;
}

app.post('/masuk/peserta', function (request, response) {
    var peserta = require('./model/peserta')

    var body = request.body
    console.log(body)

    var password = sha256(body['password'], '12345')

    peserta.model.where({nama_akun: body['nama_akun']}).fetch().then(function (model) {
        if (model) {
            if (model.get('password') == password) {
                response.json({
                    sukses: true,
                    api_key: model.get('api_key'),
                    pesan: "Berhasil"
                })
                return;                
            } else {
                response.json({
                    sukses: false,
                    pesan: "Password salah"
                })
                return;
            }
        } else {
            response.json({
                sukses: false,
                pesan: "Nama akun tidak terdaftar"
            })
            return;
        }
    }).catch(function(err) {
        console.log('Fetching failed')
        console.log(err)
        response.status(500).send("Cannot validate peserta: " + err)
    })
})

app.get('/tpi/all', function(request, response) {
    var peserta = require('./model/peserta')
    var tpi = require('./model/tpi')

    var body = request.query
    console.log(body)
    if (!body['api_key']) {
        response.status(403).json({
            msg: "No API Key"
        })
    } else {
        peserta.model.where({api_key: body['api_key']}).fetch().then(function (model) {
            if (!model) {
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
})

// app.get('/tpi/proses', function () {
//     var peserta = require('./model/peserta')
//     var tpi = require('./model/tpi')
//     var sesi = require('./model/sesi')

//     var body = request.query
//     console.log(body)
//     if (!body['api_key']) {
//         response.status(403).json({
//             msg: "No API Key"
//         })
//     } else {
//         peserta.model.where({api_key: body['api_key']}).fetch().then(function (model) {
//             if (!model) {
//                 response.json({
//                     msg: "Something is wrong with your API Key. Your data is not here. Contact the administrator."
//                 })
//                 return;                
//             }

//             tpi.model.where({id: body['id_tpi']}).then(function (tpi_model) {
//                 if (!tpi_model) {
//                     response.json({
//                         msg: "TPI not found"
//                     })
//                     return;                    
//                 }

//                 sesi.model.where({})

//                 response.json({
//                     daftar: tpi_list
//                 })
//             }).catch(function(err) {
//                 console.log('Fetching failed')
//                 console.log(err)
//                 response.status(500).send("Cannot retrieve TPI: " + err)                
//             })
//         }).catch(function(err) {
//             console.log('Fetching failed')
//             console.log(err)
//             response.status(500).send("Cannot validate peserta: " + err)
//         })
//     }    
// })

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});