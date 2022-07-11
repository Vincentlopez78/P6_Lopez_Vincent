// @ts-nocheck
// @ts-nocheck
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
    if (sauceObject.userId !== req.auth.userId) {
        return res.status(403).json("requête non authorisée");
    };
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
    const userId = req.body.userId;
    const like = req.body.like;
    const sauceId = req.params.id;

    Sauces.findOne({ _id: sauceId })
        .then(sauce => {
            // Nouvelles valeurs à modifier
            const newValues = {
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked,
            }
            // Différents cas:
            switch (like) {
                case 1:  // CAS: sauce liked
                    newValues.usersLiked.push(userId);
                    break;
                case -1:  // CAS: sauce disliked
                    newValues.usersDisliked.push(userId);
                    break;
                case 0:  // CAS: Annulation du like/dislike
                    if (newValues.usersLiked.includes(userId)) {
                        // si on annule le like
                        // IndexOf va chercher la valeur du like
                        const index = newValues.usersLiked.indexOf(userId);
                        // Splice va retirer la valeur du like
                        newValues.usersLiked.splice(index, 1);
                    } else {
                        // si on annule le dislike
                        const index = newValues.usersDisliked.indexOf(userId);
                        newValues.usersDisliked.splice(index, 1);
                    }
                    break;
            };
            // Calcul du nombre de likes / dislikes
            newValues.likes = newValues.usersLiked.length;
            console.log(newValues.usersLiked.length);
            newValues.dislikes = newValues.usersDisliked.length;
            // Mise à jour de la sauce avec les nouvelles valeurs
            Sauces.updateOne({ _id: sauceId }, newValues )
                .then(() => res.status(200).json({ message: 'Sauce notée !' }))
                .catch(error => res.status(400).json({ error }))  
        })
        .catch(error => res.status(500).json({ error }));
    }