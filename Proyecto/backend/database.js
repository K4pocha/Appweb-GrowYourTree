// database.js
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;

const connectDB = async () => {
    try {
        await client.connect();
        db = client.db(process.env.DB_NAME);
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('Error al conectar a MongoDB', error);
        process.exit(1);
    }
};

const getDB = () => {
    if (!db) {
        throw new Error('No se ha establecido una conexión con la base de datos');
    }
    return db;
};

module.exports = { connectDB, getDB };
