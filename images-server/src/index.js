const env = require('dotenv');
const express = require('express');
const config = require('./config');
const bodyParser = require('body-parser');
const router = require('./routers/images-router');
const path = require('path');
const cors = require('cors');
const validateJwt = require('./middlewares/jwt-validation-middlewar');

env.config();

const PORT = process.env.PORT || 5002;
const app = express();

const imagesDir = path.join(__dirname.replace('\\src', ''), 'public');

app.use(bodyParser.json())

const staticCors = cors({
    methods: 'GET'
});

const imageCors = cors({
    allowedHeaders: '*',
    origin: 'http://localhost:5001',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
});

app.use(validateJwt);

app.use('/images', express.static(imagesDir));
app.use('/image', router);


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
});
