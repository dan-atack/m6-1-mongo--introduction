'use strict';

const { MongoClient } = require('mongodb');
const assert = require('assert');

const createGreeting = async (req, res) => {
  const data = req.body;
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  // wrapping in try/catch, like a real pro:
  try {
    await client.connect();
    console.log("looks like we're in guv.");

    const db = client.db('exercises');

    // r is our Record of what is going in:
    const r = await db.collection('two').insertOne(data);
    assert.equal(1, r.insertedCount);
    res.status(201).json({ status: 201, data: data });
    client.close();
    console.log('disconnected.. but in a good way!');
  } catch (err) {
    console.log(err.stack);
    res.status(404).json({ status: 404, data: req.body, message: 'uh oh.' });
  }
};

// 2.3
const getGreeting = async (req, res) => {
  const { _id } = req.params;
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    console.log('jawohl.');
    const db = client.db('exercises');
    await db.collection('two').findOne({ _id }, (err, result) => {
      result
        ? res.status(200).json({ status: 200, _id, data: result })
        : res.status(404).json({ status: 404, _id, data: 'not found' });
      client.close();
    });
  } catch {
    console.log('mah stack blew up :(');
  }
};

// 2.4
const getSeveralGreetings = async (req, res) => {
  // get query params with object deconstruction from req.query:
  let { start, limit } = req.query;
  // conditional here = default values if the queries aren't made, or contain negative numbers:
  start = start != undefined ? Number(start) : 0;
  limit = limit != undefined && limit > 0 ? Number(limit) : 10;
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    console.log('Wier sint in das schiesse.');
    const db = client.db('exercises');
    await db
      .collection('two')
      .find()
      .toArray((err, result) => {
        if (result != null) {
          // prevent errors from invalid start value: eliminate negatives or values greater than the results length:
          const safeStart = start >= 0 && start < result.length ? start : 0;
          // prevent errors from invalid limit value, given that negatives have already been removed above:
          const end =
            safeStart + limit < result.length
              ? // if limit is within acceptable range, use it:
                safeStart + limit
              : // otherwise, cap it at the end: (no need to subtract one, since we stop BEFORE the index value for 'end')
                result.length;
          console.log(safeStart, end);
          const messages = result.slice(safeStart, end);
          res.status(200).json({
            status: 200,
            startIndexUsed: safeStart,
            endIndexUsed: end,
            greetings: messages,
          });
        } else {
          res.status(404).json({ status: 404, message: err });
        }
        client.close();
        console.log('in and out in 45 microseconds.');
      });
  } catch {
    console.log('looks like we caught a hanger sarge.');
  }
};

// 2.5
const deleteGreeting = async (req, res) => {
  const { _id } = req.params;
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    console.log('deletion initiated.');
    const db = client.db('exercises');
    // we'll use del as our variable name for the validation bit:
    const r = await db.collection('two').deleteOne({ _id });
    assert.equal(1, r.deletedCount);
    res.status(204).json({ status: 204, _id });
  } catch (err) {
    console.log(err.stack);
  }
};

const updateGreeting = async (req, res) => {
  const { _id } = req.params;
  const { hello } = req.body;
  if (!Object.keys(req.body).includes('hello')) {
    res.status(400).json({
      status: 400,
      message: 'I dont know why you say [anything else], I say hello',
      data: req.body,
    });
  }
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    console.log('beginning update');
    const db = client.db('exercises');
    // convert req params to query (first of two update arguments):
    const query = { _id }; // the underscore ID must always be kept as an object, not just a variable...
    const newValue = { $set: { hello } }; // similarly for the value of the update; everything must have curly braces to denote objectivity.
    const r = await db.collection('two').updateOne(query, newValue); // then you can plug them in as variables!
    assert.equal(1, r.matchedCount);
    assert.equal(1, r.modifiedCount);
    res.status(200).json({ status: 200, _id, ...req.body });
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports = {
  createGreeting,
  getGreeting,
  getSeveralGreetings,
  deleteGreeting,
  updateGreeting,
};
