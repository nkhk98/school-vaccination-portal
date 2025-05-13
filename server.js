const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const vaccinationDriveRoutes = require('./routes/vaccinationDriveRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded request bodies, for form data

// Define a route for the root path '/'
app.get('/', (req, res) => {
    res.send('Welcome to the School Vaccination Backend!');
  });

  
// Routes
app.use('/api/students', studentRoutes);
app.use('/api/vaccination-drives', vaccinationDriveRoutes);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});