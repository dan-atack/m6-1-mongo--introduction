// first things first, let's be strict:
'use strict';

// next, let's get the MongoClient class so we can access our DB through an instantiation:
const { MongoClient } = require('mongodb');

// here we make a function that will create a connection to an existing (empty) database, which is running on a server at localhost 27017:
const dbFunction = async (dbName) => {
  const client = new MongoClient('mongodb://localhost:27017', {
    // Look up what the heck this means:
    useUnifiedTopology: true,
  });
  // first you connect to the db, and you should always await since this is an asynchronous function (see the async at the top):
  await client.connect();
  console.log('connected!');

  // next, create a variable for the db itself, which is a property of the client (MongoClient) object you made above:
  const db = client.db(dbName);
  await db
    // Databases are full of collections, so once inside the DB you specifiy which collection you're referring to,
    .collection('one')
    // and in this case, you insert one object to the database:
    .insertOne({ name: 'John Glenn', commie: 'Yuri Gaga' });
  // When you're finished interacting with the database you should always close the doors after yourself!
  client.close();
  console.log('disconnected!');
};

dbFunction('exercise_one');
