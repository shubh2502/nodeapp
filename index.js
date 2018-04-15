var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require('path');
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var dbConfig = require('./dbconfig');
var storageConfig = require('./storageConfig');
// Import the mssql package
var sql = require("mssql");
// Import query builder
var queryModule = require('./query');
// Impoer azure storage sdk
var azureSdk = require('azure-storage');

var blobService = azureSdk.createBlobService(storageConfig.account, storageConfig.key);

// var blobService = {};

server.listen(4300, function () {
    console.log('Server listening to port: 4300');
});

app.use('/public', express.static(path.join(__dirname, 'public')));

// parse application/json
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/public', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/', function (req, res) {
    res.send('OK');
});

app.get('/getAllData', function (req, res) {
    // establish connection in sql server
    getCustomers().then(result => {
        console.dir(result);
        res.send({ status: 200, data: result });
    }).catch(err => {
        // ... error checks
        console.log('err', err);
        res.send({ status: 201, data: err });
    });
});

app.post('/bulkInsert', function (req, res) {
    // establish connection in sql server
    postCustomers().then(result => {
        console.dir(result);
        res.send({ status: 200, data: result });
    }).catch(err => {
        // ... error checks
        console.log('err', err);
        res.send({ status: 201, data: err });
    });
});

app.post('/uploadData', function (req, res) {
    uploadImage(req).then(result => {
        console.dir(result);
        res.send({ status: 200, data: result });
    }).catch(err => {
        // ... error checks
        console.log('err', err);
        res.send({ status: 201, data: err });
    });
});


// This function connects to a SQL server, executes a SELECT statement,
// and displays the results in the console.
function getCustomers() {
    return new Promise(function (resolve) {
        const pool1 = new sql.ConnectionPool(dbConfig, err => {
            // ... error checks
            if (err)
                console.log(err);
            // Query
            var _query = queryModule.prepareGetQuery();
            pool1.request().query(_query, (err, result) => {
                if (err)
                    console.log(err);
                // ... error checks
                resolve(result);
            });
        });
    });
}

function postCustomers() {
    return new Promise(function (resolve) {
        const pool1 = new sql.ConnectionPool(dbConfig, err => {
            // ... error checks
            // Query
            var _query = queryModule.prepareBulkQuery(100);
            pool1.request().query(_query, (err, result) => {
                // ... error checks
                resolve(result);
            });
        });
    });
}

function uploadImage(image) {
    return new Promise((resolve, reject) => {

        var form = new multiparty.Form();

        form.on('part', function (part) {
            if (part.filename) {
                var filename = part.filename;
                var size = part.byteCount;
                var onError = function (error, result, response) {
                    if (error) {
                        res.send({ grrr: error });
                    }
                };
                blobService.createBlockBlobFromStream(storageConfig.container, filename, part, size, onError);
                resolve('OK');
            } else {
                form.handlePart(part);
            }
        });
        form.parse(image);
    });
}