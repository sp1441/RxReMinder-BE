const express = require('express');
const router = express.Router();
const { DateTime } = require('luxon');
const passport = require('passport');

// import the Dose model
const { Dose } = require('../models/');

// middleware to protect all routes
// router.use(passport.authenticate('jwt', { session: false }));

// GET make a dose route to get all dose http://localhost:8000/doses
router.get('/', async (req, res) => {
    try {
        const doses = await Dose.find();
        // res.header("Access-Control-Allow-Origin", "*");
        res.status(200).json(doses);
    } catch (error) {
        // res.header("Access-Control-Allow-Origin", "*");
        res.json({ message: 'There was an issue, please try again...' });
    }
});

// GET user's untaken doses for the current day http://localhost:8000/doses
router.get('/today', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const doses = await Dose.find({ user: req.user.id, taken: false }).populate('medication').populate('prescription').populate('user');
        
        const today = DateTime.local().startOf('day');
        const todaysDoses = doses.filter(dose => {
            const parsedTime = DateTime.fromJSDate(dose.time).startOf('day');
            // console.log(parsedTime.toISO(), today.toISO(), parsedTime.toISO() === today.toISO());            
            return parsedTime.toISO() === today.toISO();
        });
        // res.header("Access-Control-Allow-Origin", "*");
        res.status(200).json(todaysDoses);
    } catch (error) {
        // res.header("Access-Control-Allow-Origin", "*");
        res.json({ message: 'There was an issue, please try again...' });
    }
});

// GET a specific doses by ID http://localhost:8000/doses/:id
router.get('/:id', async (req, res) => {
    try {
        const dose = await Dose.findById(req.params.id);
        if (!dose) {
            res.status(404).json({ message: 'Dose not found' });
        } else {
            res.status(200).json(dose);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dose', error });
    }
});

// POST a new dose http://localhost:8000/doses/new
router.post('/new', async (req, res) => {
    try {
        const newDose = new Dose(req.body);
        const savedDose = await newDose.save();
        // res.header("Access-Control-Allow-Origin", "*");
        res.status(201).json(savedDose);
    } catch (error) {
        // res.header("Access-Control-Allow-Origin", "*");
        res.json({ message: 'There was an issue, please try again...' });
    }
});

// PUT/update a dose http://localhost:8000/doses/:id
router.put('/taken/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const updatedDose = await Dose.findByIdAndUpdate(req.params.id, { taken: true }, { new: true });
        // res.header("Access-Control-Allow-Origin", "*");
        res.status(200).json(updatedDose);
    } catch (error) {
        // res.header("Access-Control-Allow-Origin", "*");
        res.json({ message: 'There was an issue, please try again...' });
    }
});

// PUT/update a dose http://localhost:8000/doses/:id
router.put('/:id', async (req, res) => {
    try {
        const updatedDose = await Dose.findByIdAndUpdate(req.params.id, req.body, { new: true });
        // res.header("Access-Control-Allow-Origin", "*");
        res.status(200).json(updatedDose);
    } catch (error) {
        // res.header("Access-Control-Allow-Origin", "*");
        res.json({ message: 'There was an issue, please try again...' });
    }
});

// DELETE a dose http://localhost:8000/doses/:id
router.delete('/:id', async (req, res) => {
    try {
        const deletedDose = await Dose.findByIdAndDelete(req.params.id);
        // res.header("Access-Control-Allow-Origin", "*");
        res.status(200).json({ message: 'Dose deleted successfully', dose: deletedDose });
    } catch (error) {
        // res.header("Access-Control-Allow-Origin", "*");
        res.json({ message: 'There was an issue, please try again...' });
    }
});

module.exports = router;
