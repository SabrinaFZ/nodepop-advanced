'use script';

const mongoose = require('mongoose');

// define ad schema
const adSchema = new mongoose.Schema({
    name: String,
    sell: Boolean,
    price: Number,
    picture: String,
    tags: [String]
});

// add function to model to filter
adSchema.statics.filterBy = function (filter, sortCondition, limit, skip){
    let query = Ad.find(filter);
    query.sort(sortCondition);
    query.limit(limit);
    query.skip(skip);
    return query;
}

adSchema.statics.getTags = function(){
    let query = Ad.find();
    query.select('tags');
    return query;
}

// define ad model
const Ad = mongoose.model('Ad', adSchema);

module.exports = Ad;