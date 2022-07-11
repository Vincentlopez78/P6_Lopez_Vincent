const Sauce = require('../models/Sauces');
const fs = require('fs');
const Sauces = require('../models/Sauces');

//Affichage de toute les sauces

exports.getAllSauces = (req, res, next) => {
    Sauces.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error }));
};

//Affichage une sauce

exports.getOneSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// Création des sauces

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce ({
        ...sauceObject,
        
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDislikes: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée'}))
        .catch(error => res.status(400).json({ error }));
    };


//Modifier sauce

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    Sauces.updateOne({ _id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({ message: 'Sauce modifié'}))
        .catch(error => res.status(400).json({ error }));
}

//Suppression d'une sauce

exports.deleteSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then(sauce => {
            if(sauce != null) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimé'}))
                    .catch(error => res.status(400).json({ error }));
                });
            }
        })
        .catch(error => res.status(500).json({ error }));
};

// affiches des likes 

exports.sauceLiked = (req, res, next) => {
    const user = req.body.userId;
    const userLike = req.body.like;
    const id = req.params.id;
    Sauces.findOne({_id: id})
        .then(sauce => {
            if(sauce != null) {
                const objectLikeDislikeSauce = {
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked,
                }
                switch(userLike) {
                    case 1:
                        objectLikeDislikeSauce.usersLiked.push(user);
                        break;

                    case -1:
                        objectLikeDislikeSauce.usersDisliked.push(user);
                        break;

                    case 0:
                        if(objectLikeDislikeSauce.includes(user)) {
                            const index = objectLikeDislikeSauce.usersLiked.indexOf(user);
                            objectLikeDislikeSauce.splice(index, 1);
                        } else {
                            const index = objectLikeDislikeSauce.usersDisliked.indexOf(user);
                            objectLikeDislikeSauce.splice(index, 1);
                        }
                        break;
                };
                objectLikeDislikeSauce.likes = objectLikeDislikeSauce.usersLiked.length;
                objectLikeDislikeSauce.dislikes = objectLikeDislikeSauce.usersDisliked.length;
                    // Mise à jour de la sauce avec les nouvelles valeurs
                    Sauces.updateOne({ _id: id }, objectLikeDislikeSauce )
                        .then(() => res.status(200).json({ message: 'Sauce notée !' }))
                        .catch(error => res.status(400).json({ error }));
            }
    }) 
        .catch((error) => res.status(400).json ({ error }));
}
