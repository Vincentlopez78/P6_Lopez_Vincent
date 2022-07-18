const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passwordValidator = require('password-validator');
const emailValidator = require('email-validator');

const userPasswordSchema = new passwordValidator();

userPasswordSchema
.is().min(8) //8 caractères mini
.is().max(30) //30 caractères maxi
.has().uppercase(1) //1 majuscules
.has().lowercase() // doit contenir des lettres minuscule
.has().digits(2) // doit avoir 2 chiffres
.has().not().spaces() // ne doit pas contenir d'espace
.is().not().oneOf(['Password123', 'Motdepasse123']); // mot de passe blacklister


exports.signup = (req, res, next) => {
    if (!emailValidator.validate(req.body.email) || !userPasswordSchema.validate(req.body.password)) {
        return res.status(400).json({message: 'Votre mot de passe doit contenir minimum 8 caractère, 1 majuscule et 2 chiffres et/ou vérifiez le format de votre email.'})
    } else if (emailValidator.validate(req.body.email) || userPasswordSchema.validate(req.body.password)) {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    };
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if(!user) {
                return res.status(401).json({ message: 'Mot de passe et/ou identifiant incorrect' });
            } else {
                bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({ message: 'Mot de passe et/ou identifiant incorrect' })
                    } else {
                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign(
                                { userId: user._id },
                                "RANDOM_TOKEN_SECRET",
                                { expiresIn: '24h'}
                            )
                        });
                    };
                })
                .catch(error => {
                    res.status(500).json({ error });
                });
            };
        })
        .catch(error => {
            res.status(500).json({ error })
        });
};
