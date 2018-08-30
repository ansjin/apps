var express		= require('express'),
	logger		= require('morgan'),
	bodyParser	= require('body-parser'),
	mongoose	= require('mongoose'),
	cfg			= require('./config/config');
var os 			= require('os');
var ip 			= require('ip');
var MongoClient = require('mongodb').MongoClient;
var osutils 			= require('os-utils');

var mongohost = process.env.MONGODB_HOST || cfg.mongo.uri;
var mongodb = process.env.MONGODB_DB || cfg.mongo.db;

var app = express();
mongoose.connect('mongodb://'+mongohost+'/'+mongodb, function(err, res) {
    if(err) throw err;
    console.log('Connected to MongoDB');
});
app.use(logger('dev'));
app.use(bodyParser.json());


app.all('/*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	if (req.method == 'OPTIONS') {
		res.status(200).end();
	} else {
		next();
	}
});

app.use('/', require('./routes/index'));

app.use(function(req, res, next) {
	res.status(404);
	next();
});

app.set('port', process.env.PORT || cfg.app.port);
var server = app.listen(app.get('port'), function() {
	console.log('RESTful API server running on port: ' + server.address().port);
});
