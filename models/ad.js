'use script';

const mongoose = require('mongoose');


// define ad schema
const adSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    sell: {
        type: Boolean,
        index: true
    },
    price: {
        type: Number,
        index: true
    },
    picture: String,
    tags: {
        type: [String],
        index: true
    }
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