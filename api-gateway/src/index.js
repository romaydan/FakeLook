const express = require('express');
const env = require('dotenv');
const cors = require('cors');
const authRouter = require('./routers/authentication.router');
const postRouter = require('./routers/posts.router');
const friendsRouter = require('./routers/friends.router');
const groupsRouter = require('./routers/groups.router');

env.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json())
app.use('/auth', authRouter);
app.use('/posts', postRouter);
app.use('/friends', friendsRouter);
app.use('/groups', groupsRouter);

app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}...`);
})
