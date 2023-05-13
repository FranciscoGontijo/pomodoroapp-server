const express = require('express');
const app = express();
require("dotenv").config();


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("Server running on port 5000...");
});