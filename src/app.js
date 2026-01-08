require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const compression = require('compression');
const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const myloggerLog = require('./logger/mylogger.log');
const checkOverload = require('./helpers/check.connect').checkOverload;

//init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//test redis pubsub
// const inventoryTest = require('../src/test/inventory.test');
// const productTest = require('../src/test/product.test');

// (async () => {
//     // Đảm bảo subscriber đã sẵn sàng
//     await inventoryTest.listenToPurchaseEvent();

//     // Thêm một chút delay để chắc chắn Redis đã subscribe xong
//     await new Promise((res) => setTimeout(res, 1000));

//     // Sau đó mới publish
//     await productTest.purcharseProduct('product:123', 1);
// })();



//check overload
// checkOverload();
app.use((req, res, next) => {
    const requestId = req.headers['x-request-id'] 
    req.requestId = requestId || uuidv4();
    myloggerLog.log(`input params::${req.method}`, [
        req.path,
        req.requestId,
        req.method === 'POST' ? req.body : req.query
    ])
    next()
})


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
    const resMessage = `${error.status} - ${Date.now()-error.now} ms - Response: ${JSON.stringify(error)}`
    myloggerLog.error(resMessage, [
        req.path,
        req.requestId,
        {
            message: error.message
        }
    ])
    res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal Server Error',
    });
})
module.exports = app;