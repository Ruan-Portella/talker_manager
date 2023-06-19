const express = require('express');
const crypto = require('crypto');
const validateEmail = require('../middlewares/validateEmail');
const validatePassword = require('../middlewares/validatePassword');

const route = express.Router();

route.post('/', validateEmail, validatePassword, async (req, res) => {
    try {
        const token = crypto.randomBytes(8).toString('hex');
        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
});

module.exports = route;