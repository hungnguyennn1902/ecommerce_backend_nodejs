'use strict'

const mongoose = require('mongoose')
const os = require('os');
const _SECONDS = 5000; 

// Count connect
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log(`Number of connections: ${numConnection}`);
}

// Check overload
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        const maxConnections = numCores * 5;
        console.log(`Active Connections: ${numConnection}`);
        console.log(`Memory Usage: ${(memoryUsage / 1024 / 1024).toFixed(2)} MB`);
        if (numConnection > maxConnections) {
            console.warn('Warning: High number of connections!');
        }
    }, _SECONDS);


}
module.exports = {
    countConnect,
    checkOverload
}