const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const connexionLimiter = require('../middleware/limit');

router.post('/signup', userCtrl.signup);
router.post('/login', connexionLimiter, userCtrl.login);

module.exports = router;