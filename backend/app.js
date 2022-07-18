
const express = require('express');
const helmet = require('helmet');
const app = express();

const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');

require("dotenv").config()

const bodyParser = require('body-parser');

const path = require('path');


const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');


//Connexion à Mongoose
// @ts-ignore
mongoose.connect(process.env.MONGO_URI,
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//Sécurité QWASP
// @ts-ignore
// configuration des en-têtes HTTP
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// controle des entrées avec '$' et '.' dans mongo
app.use(mongoSanitize());

//CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//lit l'entrée d'un formulaire et le stocke en tant qu'objet javascript accessible par l'intermédiaire de req.body
app.use(bodyParser.json());

//Affichage des images
app.use("/images", express.static(path.join(__dirname,'images')));


app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;