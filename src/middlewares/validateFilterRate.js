const validateFilterRate = (req, res, next) => {
    const { rate } = req.query;

    if (rate && (Number(rate) < 1 || Number(rate) > 5 || !Number.isInteger(Number(rate)))) {
        return res.status(400).json({
            message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
        });
    }

    next();
};

module.exports = validateFilterRate;