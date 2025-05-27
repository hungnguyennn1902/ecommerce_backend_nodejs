'use strict'
const mongoose = require('mongoose')
const connectString = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';
mongoose.connect(connectString).then(()=> consologe.log('MongoDB connected'))
    .catch(() => console.log(`MongoDB connection error`));
if (1 ===0){
    mongoose.set('debug', true);
    mongoose.set('debug', {color:true});
} 
module.exports = mongoose;