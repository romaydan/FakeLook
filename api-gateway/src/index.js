const express = require('express');
const env = require('dotenv');
const cors = require('cors');
const authRouter = require('./routers/authentication.router');
const postRouter = require('./routers/posts.router');
const friendsRouter = require('./routers/friends.router');

env.config();

const PORT = process.env.PORT || 5010;
const app = express();

app.use(cors({
    origin: '*'
}));
app.use(express.json())
app.use('/auth', authRouter);
app.use('/posts', postRouter);
app.use('/friends', friendsRouter);

app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}...`);
})