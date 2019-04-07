'use strict';

const multer = require('multer');
const connectionRabbitMQ = require('./../../lib/connectRabbitMQ');
const upload = multer({ storage: multer.memoryStorage() })
const express = require('express');
const router = express.Router();

const Ad = require('../../models/ad');

const queueName = 'upload';

// Get all ads (without filter)
router.get('/', async(req, res, next) => {
    try{
        // set query params
        let tags = req.query.tags;
        let sort = req.query.sort;
        let sell = req.query.sell;
        let price = req.query.price;
        let name = req.query.name;
        let limit = parseInt(req.query.limit);
        let skip = parseInt(req.query.skip);
        
        // create object to save schema properties to filter
        const filter = {};
        
        if(tags){
            filter.tags = tags;
        }
        
        if(sell){
            filter.sell = sell;
        }
        
        if (price) {
            filter.price = filterPrice(price);
        }
        
        if(name){
            filter.name = new RegExp('^' + req.query.name, 'i');
        }
        
        // execute filterBy
        let result = await Ad.filterBy(filter, sort, limit, skip);
        
        // send back response
        res.json({
            success:true,
            result: result
        });
        
    }catch(err){
        console.log('Ups, an error', err);
        process.exit(1);
    } 
});

// Create new ad
router.post('/', upload.single('picture'), saveToDisk,  async(req, res, next) => {
    try {
        let body = req.body;
        let ad =  new Ad(body);
        let result = await ad.save();
        
        res.json({
            success: true,
            result: result
        });
        
    } catch (err) {
        console.log('Ups, an error', err);
        process.exit(1);
    } 
});

// Get all tags
router.get('/tags', async(req, res, next) => {
    try{
        let result = await Ad.getTags();
        let tags = getTags(result);
        
        res.json({
            success: true,
            result: tags
        });
        
    } catch (err) {
        console.log('Ups, an error', err);
        process.exit(1);
    } 
});

// function to format price
function filterPrice(price){
    if (price.includes('-')) {
        price = price.split('-');
        let maxPrice = price[0] !== '' ? parseInt(price[0]) : '';
        let minPrice = price[1] !== '' ? parseInt(price[1]) : '';       
        
        if (maxPrice !== '' && minPrice !== '') {
            return {
                '$gte': maxPrice,
                '$lte': minPrice
            }
        } else if (maxPrice !== '') {
            return {
                '$gte': maxPrice
            }
        } else {
            return {
                '$lte': minPrice
            }
        }
    } else {
        return parseInt(price);
    }
}

function getTags(list){
    let tags = [];
    list.forEach((value) => {
        let tagsValue = value.tags;
        
        tagsValue.forEach((tag) => {
            if (!tags.includes(tag)) {
                tags.push(tag);
            }
        });
    });
    
    return tags;
}

async function saveToDisk(req, res, next) {

    try {

        if (!req.file) {
            next();
            return;
        }

        const conn = await connectionRabbitMQ;

        const channel = await conn.createChannel();

        setTimeout(() => {
            channel.assertQueue(queueName, { durable: true });

            channel.sendToQueue(queueName, new Buffer.from(JSON.stringify(req.file)));

            console.log(`Send file...`);
        }, 100);

        next();
    } catch(err){
        next(err);
    }
}


module.exports = router;