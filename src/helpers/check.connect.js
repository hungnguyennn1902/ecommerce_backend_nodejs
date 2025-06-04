'use strict'

const mongoose = require('mongoose')

// Count connect
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log(`Number of connections: ${numConnection}`);
}

// Check overload
module.exports = {
    countConnect
}