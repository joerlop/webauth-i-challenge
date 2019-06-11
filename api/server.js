const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session)

const usersRouter = require('../users/users-router.js');
const authRouter = require('../auth/auth-router.js');

const server = express();

const sessionConfig = {
  name: "monkey",
  secret: "keep it secret, keep it safe",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false,
    httpOnly: true 
  },
store: new KnexSessionStore({
  knex: require("../database/dbConfig"),
  tablename: "sessions",
  sidfieldname: "sid",
  createtable: true,
  clearInterval: 1000 * 60 * 60
})
} 

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use(session(sessionConfig));

server.get('/', (req, res) => {
  res.send("It's alive!");
});

server.use('/api/users', usersRouter);
server.use('/api/', authRouter);

module.exports = server;