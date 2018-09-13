const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const axios = require('axios');

const eventsRoutes = require('./routes/events');
const userRoutes = require('./routes/user');

// aA188406.
const app = express();
mongoose.connect('mongodb+srv://mitko:aA188406.@cluster0-6rsnv.mongodb.net/network',
 { useNewUrlParser: true })
    .then(() => {
        console.log('conn to database');

    }).catch((err) => {
        console.log('falied to conn to db', err);

    });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});
app.use(userRoutes);

app.use(eventsRoutes);








// places api


// module.exports = ap
module.exports = app;