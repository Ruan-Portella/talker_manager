const express = require('express');
const route = express.Router();

route.post('/', async(req, res) => {
    try {
        const token = "7mqaVRXJSp886CGr"
        return res.status(200).json({ token })
    } catch (error) {
        return res.status(500).json({ message: error})
    }
})

module.exports = route;