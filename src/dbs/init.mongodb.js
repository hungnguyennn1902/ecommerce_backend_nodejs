'use strict'
const mongoose = require('mongoose')
const { db: { host, port, name } } = require('../configs/config.mongodb')
const connectString = `mongodb://${host}:${port}/${name}`;
const { countConnect } = require('../helpers/check.connect')
class Database {
    constructor() {
        this.connect()
    }
    //connect

    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })

        }
        mongoose.connect(connectString, {
            maxPoolSize: 10,
        }).then(() => console.log(`Connected Mongodb Success PRO`))
            .catch(err => console.log(`MongoDB connection error`));

    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}
const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb



