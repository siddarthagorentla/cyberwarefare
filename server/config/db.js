const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    // Use in-memory MongoDB for development (no MongoDB installation required)
    console.log('Starting in-memory MongoDB server...');
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected (In-Memory): ${conn.connection.host}`);

    return mongoServer;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const closeDB = async () => {
  if (mongoServer) {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
};

module.exports = { connectDB, closeDB };
