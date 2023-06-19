const validateFilterDate = (req, res, next) => {
    const { date } = req.query;
    const regexDate = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    const dateValidate = regexDate.test(date);

    if (date && !dateValidate) {
        return res.status(400).json({
            message: 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"',
        });
    }
    next();
};

module.exports = validateFilterDate;