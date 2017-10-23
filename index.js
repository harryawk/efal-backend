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
            response.status(500).json({
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

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});