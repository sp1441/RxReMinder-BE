// Imports
require('dotenv').config();
const express = require('express');
const router = express.Router();
const passport = require('passport');

// import the Medication model
const { Medication } = require('../models');

// GET route for /medications
// router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
router.get('/', (req, res) => {
    Medication.find({})
        .then(medications => {
            if (medications) {
                return res.json({ medications: medications });
            } else {
                return res.json({ message: 'No medications exists' });
            }
        })
        .catch(error => {
            console.log('error', error);
            return res.json({ message: 'this is an issue, please try again' });
        });
});

router.get('/:field/:value', (req, res) => {
    let field = req.params.field;
    let value = req.params.value;
    // console.log('field', 'value', field, value);
    
    Medication.find({ [field]:[value] })
    .then((medications) => {
        console.log("medications", medications);
        return res.json({ medications: medications });
    })
    .catch(error => {
        console.log('error', error);
        return res.json({ message: 'There was an issue please try again...' });
    });
});

router.get('/:id', (req, res) => {
    Medication.findById(req.params.id)
    .then((medication) => {
        return res.json({ medication: medication });
    })
    .catch(error => {
        console.log('error', error);
        return res.json({ message: 'There was an issue please try again...' });
    })
});

router.post('/new', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let user;
    if (!req.user.id) {
        return res.json({ message: 'You must be logged in to create a medication' });
    }
    const newMedication = {
        name: req.body.name,
        category: req.body.category,
        directions: req.body.directions,
    }
    Medication.findOne(newMedication.name)
    .then(medication => {
        if (medication){
            return res.json({ message: `${medication.name} already exists` });
        } else {
            Medication.create(newMedication)
            .then(newMedication => {
                console.log('newMedication was created', newMedication);
                return res.json({ medication: newMedication });
            })
            .catch(error => {
                console.log('error', error);
                return res.json({ message: 'There was an issue please try again...' });
            });
        }
    })
    .catch(error => {
    console.log('error', error);
    return res.json({ message: 'There was an issue please try again...' });
    });
   
})

router.put('/:id', (req, res) => {
    const updateQuery = {};
    // check name
    if (req.body.name) {
        updateQuery.name = req.body.name;
    }
    // check category
    if (req.body.category) {
        updateQuery.category = req.body.category;
    }
    // check directions
    if (req.body.directions) {
        updateQuery.directions = req.body.directions;
    }
    
    Medication.findByIdAndUpdate(req.params.id, { $set: updateQuery }, { new: true })
    .then((medication) => {
        return res.json({ message: `${medication.name} was updated`, medication: medication });
    })
    .catch((error) => {
        console.log('error inside PUT /medications/:id', error);
        return res.json({ message: 'error occured, please try again.' });
    });
});

// Delete route for /medications/:id
router.delete('/:id', (req, res) => {
    
    Medication.findByIdAndDelete(req.params.id)
    .then((result) => {
        return res.json({ message: `Medication ${req.params.id} was deleted.`});
    })
    .catch((error) => {
        console.log('error inside DELETE /medications/:id', error);
        return res.json({ message: 'An error occured, please try again.' });
    });
});

module.exports = router;