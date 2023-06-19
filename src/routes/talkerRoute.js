const express = require('express');
const { readFile, readFileById } = require('../utils/readFile');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const talkers = await readFile();
        if (talkers.length === 0) return res.status(200).json([]);
        return res.status(200).json(talkers);
    } catch (error) {
        return res.status(500).json({message: {error}})
    }
})

router.get('/:id', async (req, res) => {
    try {
        const talkers = await readFileById(Number(req.params.id));
        if (talkers.length === 0) {
         throw new Error('Pessoa palestrante não encontrada')
        }
        return res.status(200).json(...talkers);
    } catch {
        return res.status(404).json({
            "message": 'Pessoa palestrante não encontrada'
          })
    }
})

module.exports = router;