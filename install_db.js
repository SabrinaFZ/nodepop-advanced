'use script';

const mongoose = require('mongoose');

// import database connection
const db = require('./lib/connectMongoose');
// import model
const Ad = require('./models/ad');
// import ads data
const adData = require('./data/ads.json');

// connected to database
db.once('open', async() => {
    console.log('Reset database...');
    try {
        // delete tables
        let resultDeleted = await Ad.deleteMany();
        console.log(`The number of ads deleted: ${resultDeleted.n}`);
        
        // insert default ads data
        let resultInserted = await Ad.insertMany(adData);
        console.log(`The number of ads inserted: ${resultInserted.length}`);

        // close connection
        db.close();
    } catch(err){
        console.log('Ups, an error ', err);
        process.exit(1);
    }
});

// error handler to connect to database
db.on('error', (err) => {
    console.log('Ups, and error', err);
    process.exit(1);
});