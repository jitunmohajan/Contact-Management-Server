require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');

app.use(cors());
app.use(express.json());


const uri = process.env.DB_CONNECTION_MONGODB;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db('contact-management');
    const contactCollection = db.collection('contact');

    app.get('/contacts', async (req, res) => {
      const cursor = contactCollection.find({});
      const contact = await cursor.toArray();

      res.send({ status: true, data: contact });
    });

    app.post('/contacts', async (req, res) => {
      const contact = req.body;

      const result = await contactCollection.insertOne(contact);

      res.send(result);
    });

    app.patch('/contacts/:id', async (req, res) => {
      const contact = req.body;
      const id = req.params.id;

      const result = await contactCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: contact }
      );

      res.send(result);
    });

    app.get('/contacts/:id', async (req, res) => {
      const id = req.params.id;

      const result = await contactCollection.findOne({ _id: ObjectId(id) });
      console.log(result);
      res.send(result);
    });

    app.delete('/contact/:id', async (req, res) => {
      const id = req.params.id;

      const result = await contactCollection.deleteOne({ _id: ObjectId(id) });
      console.log(result);
      res.send(result);
    });

  } finally {
  }
};

run().catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
