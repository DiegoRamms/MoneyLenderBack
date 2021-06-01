require('dotenv').config()
const express = require('express')
const Server = require('./models/server')
const app = express()

const server = new Server()

server.listen()