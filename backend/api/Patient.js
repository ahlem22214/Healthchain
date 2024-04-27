// Import necessary modules and models
const express = require('express');

const router = express.Router();
const User = require('../models/User');
const PatientDoctorAccess = require('../models/PatientDoctorAccess');
const DiagnosisRecord = require('../models/DiagnosisRecords');


const auth = require('../middleware/auth'); // Import auth middleware
// Import web3.js library
const { Web3 } = require('web3');

// Import your compiled smart contract artifacts
const contractABI = require('../../build/contracts/AccessManagement.json');

// Initialize web3 provider (e.g., connecting to Ganache)
const web3 = new Web3('http://localhost:8545');

// Set up contract instance
const contractAddress = '0x625c9CAeff1283B89235a61eE6d6A970339111a8'; // Address of your deployed smart contract
const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

// Route to serve doctor information
router.get('/patientinfo', auth, async (req, res) => {
  try {
    // Extract user object from request
    const user = req.user;
   // console.log(user.age)

    res.json({
      name: user.name,
      age: user.age,
      gender:user.gender,
      id: user._id
      // Add more fields if needed
    });

  } catch (error) {
    console.error('Error fetching patient info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/patientinfos/:patientId', auth, async (req, res) => {
  try {
    // Extract user object from request
    // Fetch patient's information based on patientId
    const patientId = req.params.patientId;
    const patientInfo = await User.findById(patientId);

    // Example: const patientInfo = await Patient.findById(patientId);
    // Modify this part according to your database model and structure

    res.json({
      name: patientInfo.name,
      age: patientInfo.age,
      gender: patientInfo.gender,
      id: patientInfo._id,
      // Add more fields if needed
    });

  } catch (error) {
    console.error('Error fetching patient info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to grant access to a doctor
router.post('/grant-access', auth, async (req, res) => {
  const { doctorId, accountAddress } = req.body;
  const patientId = req.user._id;
  const patientName = req.user.name;

  try {
    // Verify that the account address provided matches the one stored in the database
    const user = await User.findById(patientId);
    if (!user || user.accountAddress !== accountAddress) {
      return res.status(400).json({ status: 'FAILED', message: 'Account verification failed. Make sure you are using the correct account.' });
    }

    // Ensure doctorId is always provided as an array
    const doctorIds = Array.isArray(doctorId) ? doctorId : [doctorId];

    // Find existing patientDoctorAccess document
    let patientDoctorAccess = await PatientDoctorAccess.findOne({ patientId });

    if (!patientDoctorAccess) {
      // If no document exists, create a new one
      patientDoctorAccess = new PatientDoctorAccess({ patientId, doctorId: doctorIds });
    } else {
      // If document exists, ensure doctorId field is an array
      patientDoctorAccess.doctorId = Array.isArray(patientDoctorAccess.doctorId) 
        ? patientDoctorAccess.doctorId.concat(doctorIds) 
        : [patientDoctorAccess.doctorId].concat(doctorIds);
    }

    // Save the updated or new document
    await patientDoctorAccess.save();

    // Grant access to the doctor
    const gasLimit = 300000;
    const weiAmount = web3.utils.toWei('0.01', 'ether');
    await contract.methods.grantAccess(patientName, doctorId).send({
      from: accountAddress,
      gas: gasLimit,
      value: weiAmount
    });

    res.status(201).json({ status: 'SUCCESS', message: 'Access granted to the doctor' });
  } catch (error) {
    console.error('Error granting access to doctor:', error);
    res.status(500).json({ status: 'FAILED', message: 'Internal server error' });
  }
});




// Route to fetch PatientDoctorAccess documents
router.get('/patientDoctorAccess/:patientId', async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const patientDoctorAccess = await PatientDoctorAccess.findOne({ patientId });

    if (!patientDoctorAccess) {
      return res.status(404).send('PatientDoctorAccess not found');
    }

    const doctorIds = patientDoctorAccess.doctorId;
    console.log(doctorIds);
    res.send(doctorIds);
  } catch (error) {
    console.error('Error fetching PatientDoctorAccess document:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.delete('/revokeAccess/:doctorId', auth, async (req, res) => {
  try {
    const patientId = req.user._id;
    const doctorId = req.params.doctorId;
    const patientName = req.user.name;
    const accountAddress = req.body.accountAddress;
    console.log(accountAddress);


    // Find the user in the database
    const user = await User.findById(patientId);
    if (!user || user.accountAddress !== accountAddress) {
      return res.status(400).json({ status: 'FAILED', message: 'Account verification failed. Make sure you are using the correct account.' });
    }


    // Update the record for the patient
    const result = await PatientDoctorAccess.updateOne(
      { patientId },
      { $pull: { doctorId: doctorId } }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ error: 'Doctor ID not found in access list' });
    }

    // Emit an event to the smart contract
    const accounts = await web3.eth.getAccounts();
    await contract.methods.revokeAccess(patientName, doctorId).send({
      from: accountAddress,
      gas: 300000,
      value: web3.utils.toWei('.3', 'ether') // Send 1 ether along with the transaction
    });

    res.status(200).json({ message: 'Access revoked successfully' });
  } catch (error) {
    console.error('Error revoking access:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/Patients', async (req, res) => {
  try {
    const patients = await User.find({ role: 'Patient' });
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/deletepatient/:patientId', async (req, res) => {
  try {
    const patientId = req.params.patientId;
    // Supprimer le patient de la base de données
    await User.findByIdAndDelete(patientId);
    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/patients/:id', async (req, res) => {
  try {
    const patientId = req.params.id;
    const patient = await User.findById(patientId);
    if (patient) {
      res.status(200).json(patient); // Return patient details if found
    } else {
      res.status(404).json({ error: 'Patient not found' }); // Return 404 if patient not found
    }
  } catch (error) {
    console.error('Error fetching patient details:', error);
    res.status(500).json({ error: 'Internal Server Error' }); // Handle internal server error
  }
});

// Route pour la mise à jour d'un patient
router.put('/api/patients/:id', async (req, res) => {
  try {
    const patientId = req.params.id;
    const updatedPatientData = req.body; // Données mises à jour envoyées depuis le frontend

    // Mettez à jour le patient dans la base de données en utilisant son ID
    const updatedPatient = await User.findByIdAndUpdate(patientId, updatedPatientData, { new: true });

    res.status(200).json(updatedPatient); // Répondre avec le patient mis à jour
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





module.exports = router;