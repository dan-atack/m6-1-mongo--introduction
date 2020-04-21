// new imports!
const fileSystem = require('file-system');
const { MongoClient } = require('mongodb');
const assert = require('assert');

// assign contents of greetings.json file to a variable by reading and then parsing into distinct objects (pack and then unpack):

const greetings = JSON.parse(fileSystem.readFileSync('data/greetings.json'));

const batchImport = async (dbName, collection, greetings) => {
  const data = greetings;
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    console.log('Nous sommmes, er, dedans?');

    const db = client.db(dbName);
    // r is our Record of what was inserted, and insertMany accepts an array:
    const r = await db.collection(collection).insertMany(data);
    // assert makes sure we've added all the items by telling us if the amount of things added equals what we put in:
    assert.equal(greetings.length, r.insertedCount);
    console.log('message received');
    client.close();
    console.log('logging off.');
  } catch {
    console.log(err.stack);
  }
};

batchImport('exercises', 'greetings', greetings);
