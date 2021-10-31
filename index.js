const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//middlewiregt
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vwgx4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("rides");
        const ridesCollection = database.collection("allrides");

        const orderDatabase = client.db("orders");
        const ordersCollection = orderDatabase.collection("allorders");


        //get api
        app.get('/allrides', async (req, res) => {
            // console.log(req.query);
            const cursor = ridesCollection.find({});
            const rides = await cursor.toArray();
            res.send(rides);
        })

        app.get('/allrides/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const ride = await ridesCollection.findOne(query);
            res.send(ride);
        })

        app.get('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const order = await ordersCollection.findOne(query);
            res.send(order);
        })


        // post api

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            // console.log('hitting the post', service);
            res.json(result);
        })

        app.post('/allrides', async (req, res) => {
            const ride = req.body;
            const result = await ridesCollection.insertOne(ride);
            // console.log('hitting the post', service);
            res.send(result);
        })

        app.get('/orders', async (req, res) => {
            // console.log(req.query);
            const search = req.query.email;
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            if (search) {
                const searchResult = orders.filter(order => order.email.includes(search));
                res.send(searchResult);
            } else {
                res.send(orders);
            }
        })

        //delete api

        app.delete('/rides/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.send(result);
        })

        // update api
        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const updatedOrder = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedOrder.name,
                    email: updatedOrder.email,
                    cost: updatedOrder.cost,
                    rideName: updatedOrder.rideName,
                    status: updatedOrder.status
                },
            };
            const result = await ordersCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })



    } finally {
        // await client.close();

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running on crud ticket server');
})

app.listen(port, () => {
    console.log("running server", port);
})