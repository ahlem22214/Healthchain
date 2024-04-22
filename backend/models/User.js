 const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = require('../secret.js');

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    age: String,
    gender: String,
    role: String,
    cnss: { type: String, required: function () { return this.role === 'Patient'; } },
    specialization: { type: String, required: function () { return this.role === 'Doctor'; } },
    token: String // Add token field to store JWT token
});



UserSchema.statics.createAdminIfNeeded = async function () {
    try {
        // Check if admin user already exists
        const admin = await this.findOne({ email: 'admin@gmail.com' });
        if (!admin) {
            // Admin user doesn't exist, create it
            const hashedPassword = await bcrypt.hash('123456', 10);
            const adminData = {
                name: 'Admin',
                email: 'admin@gmail.com',
                password: hashedPassword,
                role: 'admin',
                isAdminCreated: true // Set the flag to indicate admin creation
            };
            const newAdmin = new this(adminData);
            await newAdmin.save();
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};

UserSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, role: this.role }, secretKey); // Include role in JWT payload
    this.token = token;
    return token;
};

const User = mongoose.model('User', UserSchema);


module.exports = User;