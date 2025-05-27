const compression = require('compression');
const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');


//init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression())

//init db
require('./dbs/init.mongodb');
//handling error
module.exports = app;