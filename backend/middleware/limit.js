const rateLimit = require('express-rate-limit');

// @ts-ignore
const connexionLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: 'Vous avez essayer de vous connecter trop de fois, veuillez reessayer plus tard.'
});

module.exports = connexionLimiter;