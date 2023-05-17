const express = require('express');
const app = express();
const db = require('./connection');
require("dotenv").config();
const cors = require("cors");


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: "https://pomodoroapp-nu.vercel.app/",
    })
);



const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("Server running on port 5000...");
});

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

//PUT add date and rounds (working)
app.put('/addround', async (req, res) => {
    const { userEmail, date, label, roundTime, weekDay } = req.body;
    try {
        const user = await statsModel.findOne({ userEmail: userEmail });
        if (label !== 'ADD LABEL' && label !== 'SELECT LABEL') {
            //ADD TO DATE STATS
            const dateObj = user.dateStats.find(obj => obj.roundTime == roundTime && obj.date === date);
            if (dateObj) {
                dateObj.rounds += 1;
            } else {
                const newDateObj = { date: date, rounds: 1, roundTime: roundTime, weekDay: weekDay };
                user.dateStats.push(newDateObj);
            }
            //ADD TO LABEL STATS
            const labelStatsObj = user.labelStats.find(obj => obj.label === label);
            const labelStatsDatesObj = labelStatsObj.dates.find(obj => obj.date === date && obj.roundTime == roundTime);
            if (labelStatsDatesObj) {
                labelStatsDatesObj.rounds += 1;
            } else {
                const newDateObj = { date: date, rounds: 1, roundTime: roundTime, weekDay: weekDay };
                labelStatsObj.dates.push(newDateObj);
            }
            user.save();
            res.json("Round added successfully");
        } else {
            res.json("Label not selected");
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

//PUT Delete Label from labelList: (working)
app.put('/deletelabel', async (req, res) => {
    const { userEmail, label } = req.body;
    try {
        const user = await statsModel.findOne({ userEmail: userEmail });
        const index = user.labelList.findIndex((labelObj) => labelObj.label === label);
        if (index >= 0 && index < user.labelList.length) {
            user.labelStats.splice(index, 1);
            user.labelList.splice(index, 1);
            user.save();
            res.json("Label deleted successfully");
        } else {
            res.json("Error: Couldn't find label")
        }
    } catch (err) {
        res.status(500).send(err);
    }
});
