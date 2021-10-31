const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 5000;

//middlewire
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

        // post api

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            // console.log('hitting the post', service);
            res.json(result);
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
            console.log(query);

        })

        // app.post('/products/byKeys', async (req, res) => {
        //     console.log(req.body);
        //     const keys = req.body;
        //     const query = { key: { $in: keys } }
        //     const products = await productsCollection.find(query).toArray();
        //     res.send(products);
        // })

        //         app.get('/services/:id', async (req, res) => {
        //             const id = req.params.id;
        //             const query = { _id: ObjectId(id) };
        //             const service = await servicesCollection.findOne(query);
        //             console.log('lodaing id', id);
        //             res.send(service);
        //         })

        //         // //post api
        //         app.post('/services', async (req, res) => {
        //             const service = req.body;
        //             const result = await servicesCollection.insertOne(service);
        //             console.log('hitting the post', service);
        //             res.json(result);
        //         })

        //         app.delete('/services/:id', async (req, res) => {
        //             const id = req.params.id;
        //             const query = { _id: ObjectId(id) };
        //             const result = await servicesCollection.deleteOne(query);
        //             console.log('deleting user with id', id);
        //             res.json(result);
        //         })


    } finally {
        // await client.close();

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running on crud server');
})

app.listen(port, () => {
    console.log("running server", port);
})