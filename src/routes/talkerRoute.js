const express = require('express');
const { readFile, readFileById } = require('../utils/readFile');
const { writeFile } = require('../utils/writeFile');
const validateToken = require('../middlewares/validateToken');
const validateName = require('../middlewares/validateName');
const validateTalk = require('../middlewares/validateTalk');
const validateAge = require('../middlewares/validateAge');
const validateWatched = require('../middlewares/validateWatched');
const validateRate = require('../middlewares/validateRate');
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

router.post('/', validateToken, validateName, validateAge, validateTalk, validateWatched, validateRate,  async (req, res) => {
    try {
        const { body } = req;
        const talkers = await readFile();
        const newTalker = {
            id: Number(talkers[talkers.length - 1].id) + 1,
            ...body
        }
        await writeFile(newTalker);
        return res.status(201).json(newTalker);
    } catch (error) {
        return res.status(500).json({error: error})
    }
})

module.exports = router;