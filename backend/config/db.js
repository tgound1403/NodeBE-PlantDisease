//Connection file to mongo db
const color = require("colors");
const { connect } = require("mongoose");
require('dotenv').config()

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:admin@cluster0.iey5z.mongodb.net/plant_disease'

const connectDB = async () => {
    try {
        const conn = await connect(MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    } catch (error) {
        console.error(`Error: ${error.message}`.red.bold);
        process.exit();
    }
};

module.exports = connectDB; 