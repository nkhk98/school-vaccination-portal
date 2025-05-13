const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://nkdbuser:n5VJHNzt5JUZKZPE@schoolvac.buai3yr.mongodb.net/?retryWrites=true&w=majority&appName=SchoolVac', { // Replace with your MongoDB URI
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;