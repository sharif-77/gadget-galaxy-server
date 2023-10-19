const express = require("express");
require("dotenv").config();
var cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Brands server is running wow");
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
    const upComingsCollection = client.db("upcomingsDb").collection("upcomings");

    app.get("/upcomings", async (req, res) => {
      const cursor = await upComingsCollection.find().toArray();
      res.send(cursor);
    });
    app.get("/brands", async (req, res) => {
      const cursor = await brandCollection.find().toArray();
      res.send(cursor);
    });

    app.post('/products',async (req,res)=>{
      const data=req.body;
      const result = await productsCollection.insertOne(data);
      res.send(result)
   })
   app.get("/products", async (req, res) => {
    const cursor = await productsCollection.find().toArray();
    res.send(cursor);
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
