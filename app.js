const express = require('express');
const app = express();
const db = require('./connection');
require("dotenv").config();


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Stats model use:
const statsModel = require('./models/statsModel');

//ALL REQUESTS FOR STATS MODEL:
//POST Create new user when signing in: (working)
app.post('/createnewuser', async (req, res) => {
    const userEmail = req.body.userEmail;
    const stats = {
        userEmail: userEmail,
        dateStats: [],
        labelStats: [],
        labelList: []
    };
    try {
        const newUserStats = await statsModel.create(stats);
        res.json(newUserStats);
    } catch (err) {
        res.status(500).send(err);
    }
});

//GET user stats: (working)
app.get('/userstats/:email', async (req, res) => {
    const userEmail = req.params.email;
    try {
        const userStats = await statsModel.findOne({ userEmail: userEmail });
        res.json(userStats);
    } catch (err) {
        res.status(500).send(err);
    }
});

//GET user label list: (working)
app.get('/labellist/:email', async (req, res) => {
    const userEmail = req.params.email;
    try {
        const userStats = await statsModel.findOne({ userEmail: userEmail });
        res.json(userStats.labelList);
    } catch (err) {
        res.status(500).send(err);
    }
});

//GET user label Stats: (working)
app.get('/labelstats/:email', async (req, res) => {
    const userEmail = req.params.email;
    try {
        const userStats = await statsModel.findOne({ userEmail: userEmail });
        res.json(userStats.labelStats);
    } catch (error) {
        res.status(500).send(err);
    }
});

//PUT Add label (working)
app.put('/addlabel', async (req, res) => {
    const { label, color, userEmail } = req.body;

    try {
        const userUpdated = await statsModel.updateOne({ userEmail: userEmail }, { $push: { labelList: { label: label, color: color }, labelStats: { label: label, color: color, dates: [] } } });
        res.json(userUpdated);
    } catch (err) {
        res.status(500).send(err);
    }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("Server running on port 5000...");
});