const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
    
    // Create admin user if needed
    const User = require('./models/User'); // Assuming the User model is defined in './models/User'
    User.createAdminIfNeeded()
        .then(() => {
            console.log('Admin user creation check completed');
            startServer(); // Start the server after admin user check completes
        })
        .catch(error => {
            console.error('Error creating admin user:', error);
        });
});

function startServer() {
    const app = express();
    const port = 3000;
    const UserRouter = require('./api/User');
    const DocterRouter = require('./api/Doctor');
    const PatientRouter = require('./api/Patient');
    const RecordRouter = require('./api/Record');

    app.use(cors());
    app.use(express.json());

    app.use('/user', UserRouter)
    app.use('/doctor', DocterRouter)
    app.use('/patient', PatientRouter)
    app.use('/record', RecordRouter)

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}