const validateWatched = (req, res, next) => {
    const { watchedAt } = req.body.talk;
    const regexDate = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    const dateValidate = regexDate.test(watchedAt);

    if (!watchedAt) return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
    if (!dateValidate) {
        return res.status(400).json({ 
            message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
        });
    }
    next();
};

module.exports = validateWatched;