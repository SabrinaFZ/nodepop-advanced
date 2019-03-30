'use script';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// import database connection
const db = require('./lib/connectMongoose');
// import model
const Ad = require('./models/ad');
const User = require('./models/User');
// import data
const adData = require('./data/ads.json');
const usersData = require('./data/users.json');

// connected to database
db.once('open', async() => {
    console.log('Reset database...');
    try {

        // initialize ads model
        await initModel(Ad, adData, 'ads');

        // initialize users model
        usersData.forEach( async user  => {
            user.password = await bcrypt.hash(user.password, 10);
        });

        await initModel(User, usersData, 'users');

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

const initModel = async (model, data, modelName) => {
    // delete tables
    let resultDeleted = await model.deleteMany();
    console.log(`The number of ${modelName} deleted: ${resultDeleted.n}`);

    // insert default ads data
    let resultInserted = await model.insertMany(data);
    console.log(
      `The number of ${modelName} inserted: ${resultInserted.length}`
    );
}