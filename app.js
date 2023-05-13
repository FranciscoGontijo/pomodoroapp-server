const express = require('express');
const app = express();
const db = require('./connection');
require("dotenv").config();


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Stats model use:
const statsModel = require('./models/statsModel');

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


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("Server running on port 5000...");
});