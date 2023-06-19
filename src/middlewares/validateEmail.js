const validateEmail = (req, res, next) => {
    const { email } = req.body;
    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const emailValidate = regexEmail.test(email);

    if (!emailValidate) {
        return res.status(400).json({ message: 'Os campos são obrigatórios e devem possuir o formato correto' });
    }

    next();
}

module.exports = validateEmail;