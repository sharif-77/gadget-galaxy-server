const express = require("express");
require("dotenv").config();
var cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Galaxy server is running wow");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.pkahof5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const brandCollection = client.db("brandsDb").collection("brands");
    const productsCollection = client.db("productsDb").collection("products");
    const upComingsCollection = client
      .db("upcomingsDb")
      .collection("upcomings");
    const cartCollection = client.db("cartsDb").collection("carts");

    app.get("/upcomings", async (req, res) => {
      const cursor = await upComingsCollection.find().toArray();
      res.send(cursor);
    });
    app.get("/brands", async (req, res) => {
      const cursor = await brandCollection.find().toArray();
      res.send(cursor);
    });

    app.post("/products", async (req, res) => {
      const data = req.body;
      const result = await productsCollection.insertOne(data);
      res.send(result);
    });
    app.get("/products", async (req, res) => {
      const cursor = await productsCollection.find().toArray();
      res.send(cursor);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const dataForUpdate = req.body;
      const {
        name,
        image,
        brandName,
        productType,
        price,
        description,
        ratting,
      } = dataForUpdate;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name,
          image,
          brandName,
          productType,
          price,
          description,
          ratting,
        },
      };
      const result = await productsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.post("/carts", async (req, res) => {
      const data = req.body;
      const result = await cartCollection.insertOne(data);
      res.send(result);
    });
    app.get("/carts/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = await cartCollection.find(query).toArray();
      res.send(cursor);
    });
    
    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
      console.log(id);
    });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
