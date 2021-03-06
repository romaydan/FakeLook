const env = require('dotenv');

env.config();

const express = require('express');
const config = require('./config');
const router = require('./routers/images-router');
const path = require('path');
const cors = require('cors');
const validateJwt = require('./middlewares/jwt-validation-middlewar');

const PORT = process.env.PORT || 5002;
const app = express();

const imagesDir = path.join(__dirname.replace('\\src', ''), 'public');

app.use(express.json())

const staticCors = cors({
    methods: 'GET'
});

const imageCors = cors({
    allowedHeaders: '*',
    origin: 'http://localhost:5001',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
});


app.use('/images', express.static(imagesDir));
app.use(validateJwt);
app.use('/image', router);


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
});
