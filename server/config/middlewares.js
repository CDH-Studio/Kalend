const bodyParser = require('body-parser');
const morgan = require('morgan');

module.exports = app => {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(morgan('dev'));
}; 