const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const connexionMax = require('../middleware/limit');

router.post('/signup', userCtrl.signup);
router.post('/login', connexionMax, userCtrl.login);

module.exports = router;