// @ts-nocheck
const rateLimit = require('express-rate-limit');

exports.connexionLimiter = rateLimit({
        windowMs: 10 * 60 * 1000,
        max: 5
});
