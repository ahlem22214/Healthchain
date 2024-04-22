// Import necessary modules and models
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth'); // Import auth middleware
const PatientDoctorAccess = require('../models/PatientDoctorAccess');


// Route to serve doctor information
router.get('/doctorinfo', auth, async (req, res) => {
  try {
    // Extract user object from request
    const user = req.user;
    console.log(user.age)
    console.log(user.specialization)


    // Ensure that the user is a doctor
   // if (user.role !== 'Doctor') {
    //  return res.status(403).json({ error: 'Forbidden: Only doctors are allowed to access this resource' });
   // }

    // Return doctor's information
    res.json({
      name: user.name,
      age: user.age,
      specialization: user.specialization,
      doctorId: user._id

      // Add more fields if needed
    });

  } catch (error) {
    console.error('Error fetching doctor info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/doctorinfos/:doctorId', auth, async (req, res) => {
  try {
    // Extract user object from request
    const user = req.user;
    console.log(user.age);
    console.log(user.specialization);

    // Ensure that the user is a doctor
    // if (user.role !== 'Doctor') {
    //  return res.status(403).json({ error: 'Forbidden: Only doctors are allowed to access this resource' });
    // }

    // Return doctor's information based on doctorId
    const doctorId = req.params.doctorId;
    // Fetch doctor's information based on doctorId
    const doctor = await User.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json({
      name: doctor.name,
      age: doctor.age,
      specialization: doctor.specialization,
      doctorId: doctor._id,
      // Add more fields if needed
    });
  } catch (error) {
    console.error('Error fetching doctor info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'Doctor' });
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch doctor details by ID
router.get('/doctorsemr/:id', async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== 'Doctor') {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json({
      name: doctor.name,
      specialization: doctor.specialization
    });
  } catch (error) {
    console.error('Error fetching doctor details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/accessiblePatients/:doctorId', auth, async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    // Find all documents in patientDoctorAccess where doctorId exists in the array
    const accessDocuments = await PatientDoctorAccess.find({ doctorId: doctorId });

    // Extract patientId from each access document
    const patientIds = accessDocuments.map(access => access.patientId);

    // Retrieve patient details for each patientId
    const patients = await User.find({ _id: { $in: patientIds } });

    // Send the array directly as the response
    res.send(patients);
  } catch (error) {
    console.error('Error fetching accessible patients:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/deletedoctor/:doctorId', async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    // Supprimer le patient de la base de données
    await User.findByIdAndDelete(doctorId);
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route pour la mise à jour d'un patient
router.put('/api/doctors/:id', async (req, res) => {
  try {
    const doctorId = req.params.id;
    const updatedDoctorData = req.body; // Données mises à jour envoyées depuis le frontend

    // Mettez à jour le patient dans la base de données en utilisant son ID
    const updatedDoctor = await User.findByIdAndUpdate(doctorId, updatedDoctorData, { new: true });

    res.status(200).json(updatedDoctor); // Répondre avec le patient mis à jour
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




module.exports = router;