const express = require('express');
const config = require('./config');
const bodyParser = require('body-parser');
const router = require('./routers/images-router');
const path = require('path');
const validateJwt = require('./middlewares/jwt-validation-middlewar');

const PORT = config.PORT;

const app = express();

const imagesDir = path.join(__dirname.replace('\\src', ''), 'public');

app.use(bodyParser.json())

app.use(validateJwt);

app.use('/images', express.static(imagesDir));
app.use('/image', router);


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
});
