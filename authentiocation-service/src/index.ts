import express from 'express';
import settings from './settings';
import flAuthRotuer from './routers/fakelook-auth-router';

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/fakelookauth', flAuthRotuer);

app.listen(settings.PORT, () => {
    console.log('listening on port ' + settings.PORT);
});