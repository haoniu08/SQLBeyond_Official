require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI_LUIZ;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    maxPoolSize: 10,
});

let dbConnection;

/**
 * This function tries to create a connection with mongoDB
 */
async function connectToMongoDB() {
    if (!dbConnection) {
        console.log("trying to connect to mongodb for the first time")
        try {
            await client.connect();
            console.log("connected to Mongodb");

            dbConnection = client.db('sql_game');

            await dbConnection.collection("users").createIndex({ username: 1 }, { unique: true });
            await dbConnection.collection("game").createIndex({ username: 1 }, { unique: true });
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    return dbConnection;
}

/**
 * This function tries to close a connection with mongoDB
 */
async function closeMongodbConnection() {
    try {
        await client.close();
        console.log("Mongodb connection closed\n");
    } catch (err) {
        console.error(err);
    }
}

module.exports = { connectToMongoDB, closeMongodbConnection };