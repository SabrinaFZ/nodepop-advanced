'use strict';

const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

const User = require('../../models/User');

router.post( '/', async (req, res, next) => {
    try{
        const email = req.body.email;
        const password = req.body.password;

        let user = null;

        if(email){
            user = await User.findOne({ email: email });
        }     

        if(!user|| ! await bcrypt.compare(password, user.password)){
            res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
            return;
        }

        // create token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: 60 * 60 * 24
        });

        res.status(200).json({
            success: true,
            token: token
        });


    } catch (err){
        next(err);
    }
});

module.exports = router;