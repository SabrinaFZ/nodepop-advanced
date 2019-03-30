'use strict';

const mongoose = require('mongoose');

// url to connect to database
const urlDb = 'mongodb://localhost:27017/nodepopDb';

// connect to database
mongoose.connect(urlDb, { useNewUrlParser: true });

// once connected to database
mongoose.connection.once('open', () => {
    console.log('Connected to database!');
})

// error handler to connect to database
mongoose.connection.on('error', (err)=> {
    console.log('Ups, error ', err);
    process.exit(1);
});

module.exports = mongoose.connection;


