const validateEmail = (req, res, next) => {
    const { email } = req.body;
    const regexEmail = /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/;
    const emailValidate = regexEmail.test(email);

    if (!email) return res.status(400).json({ message: 'O campo "email" é obrigatório' });

    if (!emailValidate) {
        return res.status(400).json({ 
            message: 'O "email" deve ter o formato "email@email.com"',
        });
    }

    next();
};

module.exports = validateEmail;