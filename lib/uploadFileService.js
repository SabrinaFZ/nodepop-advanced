'use strict';

const connectionRabbitMQ = require('./connectRabbitMQ');
const jimp = require("jimp");

const queueName = 'upload';

const main = async  () => {
    try {
        const conn = await connectionRabbitMQ;
        
        const channel = await conn.createChannel();
        
        channel.assertQueue(queueName, { durable: true });
        
        channel.consume(queueName, file => {
            uploadImage(file.content);
            setTimeout(() => {
                channel.ack(file);
            }, 500);
        });
    } catch (err) {
        throw err;
    }
};

const uploadImage = (file) => {
    try {
        if (!file) {
            return;
        }

        const parsedFile = JSON.parse(file);

        const fileName = parsedFile.originalname.split('.')[0];
        const extension = parsedFile.mimetype.split("/")[1];

        const photo = Buffer.from(parsedFile.buffer);
        jimp.read(photo, function (err, photo) {
            if (err) throw err;
            photo.resize(800, jimp.AUTO).write(`./public/images/${fileName}.${extension}`);
        });

    } catch(err){
        throw err;
    }
}

module.exports = main;