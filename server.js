'use strict';

const getAstronauts = require('./exercises/exercise-1-2');
const {
  createGreeting,
  getGreeting,
  getSeveralGreetings,
  deleteGreeting,
  updateGreeting,
} = require('./exercises/exercise-2');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const PORT = process.env.PORT || 8000;

express()
  .use(morgan('tiny'))
  .use(express.static('public'))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .use('/', express.static(__dirname + '/'))

  // exercise 1
  .get('/exercises/:dbName/:collection', getAstronauts)
  // exercise 2
  .post('/exercises/greeting', createGreeting)
  .get('/exercises/:_id', getGreeting)
  .get('/exercisetwo', getSeveralGreetings)
  .delete('/exercises/delete/:_id', deleteGreeting)
  .put('/exercises/update/:_id', updateGreeting)
  // handle 404s
  .use((req, res) => res.status(404).type('txt').send('🤷‍♂️'))

  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
