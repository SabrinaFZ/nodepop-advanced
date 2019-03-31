'use strict';

const amqplib = require("amqplib");
const dotenv = require('dotenv');
dotenv.config();

const amqpConnection = amqplib.connect(process.env.RABBITMQ_URL);

module.exports = amqpConnection;