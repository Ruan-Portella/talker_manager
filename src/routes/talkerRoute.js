const express = require('express');
const { readFile } = require('../utils/readFile');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const talkers = await readFile();
        console.log(talkers);

        if (talkers.length === 0) return res.status(200).json([]);
        return res.status(200).json(talkers);
    } catch (error) {
        return res.status(500).json({message: {error}})
    }
})

module.exports = router;