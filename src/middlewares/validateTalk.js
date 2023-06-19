const validateTalk = (req, res, next) => {
    const {talk} = req.body;

    if (!talk) return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
    next();
}

module.exports = validateTalk;