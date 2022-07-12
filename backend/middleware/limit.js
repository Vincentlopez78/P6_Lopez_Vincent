
const rateLimit = require('express-rate-limit');

exports.connexionLimiter = rateLimit({
    windowMS: 10 * 60 * 1000,
    max: 5,
    message: 'Vous avez essayer de vous connecter trop de fois, veuillez reessayer plus tard.'
});