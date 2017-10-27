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

app.get('/tpi', require('./handler/client/tpi'))

app.post('/hasil/nelayan', require('./handler/admin/hasil_nelayan_post'))

app.get('/hasil/total', require('./handler/hasil_total_get'))

app.get('/tpi/all', require('./handler/client/tpi_all_get'))

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
app.get('/hasil/nelayan/ikan', require('./handler/admin/hasil_nelayan_ikan_get'))

app.post('/hasil/nelayan/edit', require('./handler/admin/hasil_nelayan_edit_post'))

app.post('/hasil/nelayan/delete', require('./handler/admin/hasil_nelayan_delete_post'))

app.get('/hello', require('./handler/hello'))

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});