const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        // @ts-ignore
        const decodedToken = jwt.verify(token, process.env.TOKEN);
        // @ts-ignore
        const userId = decodedToken.userId;
        req.auth = { userId: userId };
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        };
        next();
    } catch(error) {
        res.status(401).json({ error });
    }
};