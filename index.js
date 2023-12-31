const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;



// Middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z4vmthe.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const toyCollection = client.db('toyHouse').collection('allToys');
        const myToyCollection = client.db('toyHouse').collection('myToys');



        // all toys

        app.get('/allToys', async (req, res) => {
            const result = await toyCollection.find().toArray();
            res.send(result);
        })


        app.get('/allToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = {
                projection: { toyName: 1, price: 1, available_quantity: 1, img: 1, rating: 1, detail: 1 }
            }
            const result = await toyCollection.findOne(query, options);
            res.send(result);
        })




        //my toys

        //create
        app.post('/myToys', async (req, res) => {
            const newToy = req.body;
            const result = await myToyCollection.insertOne(newToy);
            res.send(result);
        })


        app.get('/myToys', async (req, res) => {
            const result = await myToyCollection.find().toArray()
            res.send(result)
        })


        app.get('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await myToyCollection.findOne(query);
            res.send(result)
        })


        //update
        app.put('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateToy = req.body;
            const toy = {
                $set: {
                    price: updateToy.price,
                    available_quantity: updateToy.available_quantity,
                    detail: updateToy.detail
                }
            }
            const result = await myToyCollection.updateOne(filter, toy, options);
            res.send(result);
        })


        //delete
        app.delete('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await myToyCollection.deleteOne(query);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Toy Car Server Is Running')
})



app.listen(port, () => {
    console.log(`TOY CAR SERVER IS RUNNING ON PORT: ${port}`);
})