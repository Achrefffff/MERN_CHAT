const mongoose = require('mongoose');
 const connectDB = async()=> {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connecté: ${conn.connection.host}`.cyan.bold);
    } catch (error) {
        console.log(`Erreur: ${error.message}`.red.bold
        );
        process.exit();
    }
 }

 module.exports = connectDB;