const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const authRouter = require('../api/auth/authRouter.js');
const usersRouter = require('../api/users/usersRouter.js');
const authenticator = require('../api/auth/authenticator.js');
const server = express();
const sessionConfig = {
    name: "monster",
    secret: process.env.SESSION_SECRET || "keep it secret, keep it safe!",
    resave: false,
    saveUninitialized: process.env.SEND_COOKIES || true,
    cookie: {
      maxAge: 1000 * 60 * 10, // good for 10 mins in ms
      secure: process.env.USE_SECURE_COOKIES || false, // used over https only, set to true in production
      httpOnly: true, // true means JS on the client cannot access the cooke
      
    },
  };
server.use(helmet());
server.use(express.json());
server.use(session(sessionConfig));
 server.use('/api/users',authenticator, usersRouter);
server.use('/api/auth', authRouter);

server.get('/', (req,res) =>{
    res.json({ api: 'up'})
})

module.exports = server;