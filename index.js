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

app.get('/tpi', require('./handler/client/tpi_get'))

app.get('/tpi/all', require('./handler/client/tpi_all_get'))

app.get('/tpi/proses', require('./handler/client/tpi_proses_get'))

app.get('/tpi/laporan', require('./handler/client/tpi_laporan_get'))

app.post('/hasil/nelayan', require('./handler/admin/hasil_nelayan_post'))

app.get('/hasil/total', require('./handler/admin/hasil_total_get'))

app.get('/hasil/nelayan/ikan', require('./handler/admin/hasil_nelayan_ikan_get'))

app.post('/hasil/nelayan/edit', require('./handler/admin/hasil_nelayan_edit_post'))

app.post('/hasil/nelayan/delete', require('./handler/admin/hasil_nelayan_delete_post'))

app.post('/masuk/peserta', require('./handler/client/login_peserta'))

app.post('/daftar/peserta', require('./handler/client/daftar_peserta'))
// app.post('/sesi', require('./handler/admin/sesi_post'))

app.post('/daftar/sesi/online', require('./handler/loket/daftar_sesi_online'))

app.post('/sesi', require('./handler/admin/sesi_post'))

app.get('/sesi/all', require('./handler/admin/sesi_all_get'))

app.post('/sesi/edit', require('./handler/admin/sesi_edit_post'))

app.post('/sesi/mulai', require('./handler/admin/sesi_mulai_post'))

app.post('/sesi/peserta', require('./handler/admin/sesi_peserta_post'))

app.post('/sesi/selesai', require('./handler/admin/sesi_selesai_post'))

app.post('/sesi/tawar', require('./handler/admin/sesi_tawar_post'))

app.post('/daftar/sesi/online', require('./handler/loket/daftar_sesi_online'))
app.post('/daftar/sesi/offline', require('./handler/loket/daftar_sesi_offline'))

app.get('/hello', require('./handler/hello'))

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});