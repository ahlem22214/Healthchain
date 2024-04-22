const mongoose = require('mongoose');

const patientDoctorAccessSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming 'User' model is used for patients
   
  },
  doctorId: {
    type: [mongoose.Schema.Types.ObjectId], // Initialize as an array
    ref: 'User', // Assuming 'User' model is used for doctors
    default: [] // Default value as an empty array

  }
});

const PatientDoctorAccess = mongoose.model('PatientDoctorAccess', patientDoctorAccessSchema);

module.exports = PatientDoctorAccess;