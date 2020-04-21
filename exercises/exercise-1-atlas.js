const MongoClient = require('mongodb').MongoClient;

const dbFunction = async (dbName, collection, item) => {
  const uri =
    'mongodb+srv://dan:pw1234@cluster0-0pley.mongodb.net/test?retryWrites=true&w=majority';
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db('test').collection('devices');
    client.close();
  });

  await client.connect();
  console.log('connected');

  const db = client.db(dbName);
  await db.collection(collection).insertOne(item);

  client.close();
  console.log('disconnected');
};

dbFunction('exercise-one', 'one', { name: 'Johnny Cage' });
