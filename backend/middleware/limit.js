const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: 'Compte bloqué, revenez dans 5 minutes'
});

module.exports = limiter;