const crypto = require('crypto');
const express = require('express');
const auth = require('../middleware/auth'); // Import auth middleware
const User = require('./../models/User');
const router = express.Router();
const { ObjectId } = require('mongoose').Types;
const DiagnosisRecord = require('../models/DiagnosisRecords');
const algorithm = 'aes-256-cbc'; // AES encryption algorithm
const key = crypto.randomBytes(32); // Generate a random encryption key
const iv = crypto.randomBytes(16); // Generate a random initialization vector

// Import web3.js library
const { Web3 } = require('web3');

// Import your compiled smart contract artifacts
const contractABI = require('../../build/contracts/RecordManagment.json');

// Initialize web3 provider (e.g., connecting to Ganache)
const web3 = new Web3('http://localhost:8545');

// Set up contract instance
const contractAddress = '0xb912faAAA751423277B476C465c54Cc6225E6735'; // Address of your deployed smart contract
const contract = new web3.eth.Contract(contractABI.abi, contractAddress);


// Encrypt function
function encrypt(text) {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(iv, encryptedData) {
  try {
    if (!iv || !encryptedData) {
      throw new Error('IV or encrypted data is missing');
    }

    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error('Error decrypting:', error);
    return ''; // Return empty string or handle error accordingly
  }
}


// Route to fetch patient records by patientId
router.get('/patient-records/:patientId', async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const records = await DiagnosisRecord.findOne({ patientId: patientId });

    if (records) {
      const formattedRecords = {
        recordId: records._id,
        cards: records.diagnosisCards.map(card => {
          return {
            cardId: card._id,
            doctorId: card.doctorId,
            diagnosis: decrypt(card.iv, card.diagnosis), // Decrypt diagnosis
            details: decrypt(card.iv, card.details) // Decrypt details
          };
        })
      };
      res.json(formattedRecords);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching patient records:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to add a new diagnosis record for a patient
router.post('/patient-records/:patientId/add-record', auth, async (req, res) => {
  try {
    const doctorI = req.user._id;

    const patientId = req.params.patientId;
    const { doctorId, diagnosis, details,accountAddress } = req.body;
     // Check if the selected account matches the one associated with the user
     const user = await User.findById(doctorI);

     if (!user || user.accountAddress !== accountAddress) {
       return res.status(400).json({ status: 'FAILED', message: 'Account verification failed. Make sure you are using the correct account.' });
     }
console.log(User.accountAddress);
    // Encrypt diagnosis and details
    const encryptedDiagnosis = encrypt(diagnosis);
    const encryptedDetails = encrypt(details);


    // Create a new diagnosis card
    const newDiagnosis = {
      doctorId,
      diagnosis: encryptedDiagnosis.encryptedData,
      details: encryptedDetails.encryptedData,
      iv: encryptedDiagnosis.iv // Store IV for decryption
    };
     

    // Find the diagnosis record for the patient
    let record = await DiagnosisRecord.findOne({ patientId: patientId });

    if (!record) {
      record = new DiagnosisRecord({ patientId: patientId, diagnosisCards: [newDiagnosis] });
    } else {
      record.diagnosisCards.push(newDiagnosis);
    }
    await record.save();


    const accounts = await web3.eth.getAccounts();
    const gasLimit = 300000;
    const weiAmount = web3.utils.toWei('1', 'ether'); // Convert 0.01 ether to wei
    
    await contract.methods.addDiagnosisRecord(doctorId, patientId, encryptedDiagnosis.encryptedData, encryptedDetails.encryptedData)
        .send({  from: accountAddress,
          gas: gasLimit,
          value: weiAmount // Include 0.01 ether along with the transaction
        });
  


    res.status(201).json({ message: 'Diagnosis record added successfully' });
  } catch (error) {
    console.error('Error adding diagnosis record:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// DELETE endpoint to delete a diagnosis record by ID
router.delete('/diagnosisRecords/:recordId/cards/:cardId', async (req, res) => {
  try {
    const recordId = req.params.recordId;
    const cardId = req.params.cardId;

    // Find the diagnosis record by ID
    const record = await DiagnosisRecord.findById(recordId);

    if (!record) {
      return res.status(404).json({ error: 'Diagnosis record not found' });
    }

    // Find the index of the card to be deleted
    const cardIndex = record.diagnosisCards.findIndex(card => card._id.toString() === cardId);

    if (cardIndex === -1) {
      return res.status(404).json({ error: 'Diagnosis card not found' });
    }

    // Remove the card from the diagnosis record
    record.diagnosisCards.splice(cardIndex, 1);

    // Save the updated record
    await record.save();

    res.json({ message: 'Diagnosis card deleted successfully' });
  } catch (error) {
    console.error('Error deleting diagnosis card:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
