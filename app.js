const express = require('express');
const app = express();
const db = require('./connection');
require("dotenv").config();


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Stats model use:
const statsModel = require('./models/statsModel');

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("Server running on port 5000...");
});