const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema =  new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});
//Plugin qui ajoute une validation de pré-enregistrement pour les champs uniques dans un schéma Mongoose.
//Remplace une erreur E11000 de MongoDB par une erreur de validation.
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);