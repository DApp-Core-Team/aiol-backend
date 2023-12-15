const express = require('express');
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

require('dotenv').config();

//ejs
app.set("view engine", 'ejs');
app.use(cors());

app.use((req, res, next) => {
    const allowedOrigins = ['https://aiol-app.vercel.app', 'http://localhost:9200'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
});

app.use(
    bodyParser.json({
        limit: "15360mb",
        type: "application/json",
    })
);

app.use(
    bodyParser.urlencoded({
        limit: "15360mb",
        extended: true,
        parameterLimit: 5000000,
        type: "application/json",
    })
);

//routes
app.post('/api/search', (req, res) => {
    const { query, num_web_results, offset, country, safesearch } = req.body;
    if (!query) return res.status(400).send({ message: "Invalid request!" });

    let params = `query=${query}`;
    if (num_web_results) params = `${params}&num_web_results=${num_web_results}`;
    if (offset) params = `${params}&offset=${offset}`;
    if (offset) params = `${params}&offset=${offset}`;
    if (country) params = `${params}&country=${country}`;
    if (safesearch) params = `${params}&safesearch=${safesearch}`;

    const options = { method: 'GET', headers: { 'X-API-Key': process.env.API_KEY } };

    fetch(`https://api.ydc-index.io/search?${params}`, options)
        .then(response => response.json())
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ message: err });
        });
});

//port
app.listen(80, console.log("Listening at port 80..."))