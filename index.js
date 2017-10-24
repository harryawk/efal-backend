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
        
                    var berat_sekarang = model.get('berat_total')
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

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});