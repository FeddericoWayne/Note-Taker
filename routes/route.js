const express = require('express');

// creates a router for notes GET, POST, and DELETE requests
const notesRouter = require('./notes');

const app = express();

// makes express use the /notes route
app.use('/notes',notesRouter);

// exports module to server
module.exports = app;

