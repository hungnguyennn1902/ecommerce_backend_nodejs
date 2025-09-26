require('dotenv').config();

const compression = require('compression');
const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const checkOverload = require('./helpers/check.connect').checkOverload;

//init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//check overload
// checkOverload();

//init db
require('./dbs/init.mongodb');

//init routes
app.use('/', require('./routes/index'));

//handling error
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal Server Error',
    });
})
module.exports = app;