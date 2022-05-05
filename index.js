import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

// port
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Running server");
});

// database matters
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xj9fs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

// run function that connects to the db and perform different operation
const run = async () => {
    try {
        await client.connect();
        const database = client.db("geniusCar");
        const collection = database.collection("service");
        console.log(`database and collection are connected`);

        // getting service data from database
        app.get("/services", async (req, res) => {
            const services = await collection.find({}).toArray();
            res.send(services);
        });

        //getting a single service
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await collection.findOne(query);
            res.send(result);
        });

        // add service
        app.post("/addservice", async (req, res) => {
            const newService = req.body;
            const result = await collection.insertOne(newService);
            res.send(result);
        });

        // delete a service
        app.delete("/manage/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await collection.deleteOne(query);
            if (result.deletedCount === 1) {
                console.log("successfully deleted entry", id);
                res.send(result);
            }
        });
    } finally {
    }
};

run().catch(console.dir);

app.listen(port, () => {
    console.log("Running server successfully an dlisteneing from port: ", port);
});
