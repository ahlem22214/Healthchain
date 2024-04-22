const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('./../models/User');
const jwt = require('jsonwebtoken');
//token hashing key
const key = "7395592833c5596f3acb166837f129ab11246f4c4baf55aadde5c3b0d5329a26"

// Import web3.js library
const { Web3 } = require('web3');

// Import your compiled smart contract artifacts
const contractABI = require('../../build/contracts/Registry.json');

// Initialize web3 provider (e.g., connecting to Ganache)
const web3 = new Web3('http://localhost:8545');

// Set up contract instance
const contractAddress = '0xc54330d3f35EC676b3FB3cf866EFB240Fd57426B'; // Address of your deployed smart contract
const contract = new web3.eth.Contract(contractABI.abi, contractAddress);


router.post('/signup-patient', async (req, res) => {
    try {
        // Extract signup data and selected account address from request body
        let { name, email, password, age, gender, role, cnss, selectedAccount } = req.body;

        // Trim whitespace from input fields
        name = name ? name.trim() : '';
        email = email ? email.trim() : '';
        password = password ? password.trim() : '';
        age = age ? age.trim() : '';
        gender = gender ? gender.trim() : '';
        role = role ? role.trim() : '';
        cnss = cnss ? cnss.trim() : '';
        selectedAccount = selectedAccount ? selectedAccount.trim() : '';

        // Check for empty required fields
        if (!name || !email || !password || !age || !gender || !role || !cnss || !selectedAccount) {
            return res.json({
                status: "FAILED",
                message: "Please fill in all fields!"
            });
        }

        // Check if the email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({
                status: "FAILED",
                message: "Email already exists"
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new patient user
        const newPatient = new User({
            name,
            email,
            password: hashedPassword,
            age,
            gender,
            role,
            cnss
        });

        // Generate a new token upon successful signup
        const token = jwt.sign({ _id: newPatient._id }, key);

        // Assign the generated token to the user
        newPatient.token = token;

        // Save the new patient user to the database
        await newPatient.save();

        // Execute the smart contract function after patient signup
        const gasLimit = 300000; // Set the gas limit to a value higher than the estimated gas cost
        try {
            // Execute the smart contract function
            const result = await contract.methods.executePatientSignup(name, email, age, gender, role, cnss).send({
                from: selectedAccount, // Use the selected MetaMask account address
                gas: gasLimit,
                value: web3.utils.toWei('1', 'ether')
            });
            console.log("Transaction successful:", result);
        } catch (error) {
            console.error("Error executing smart contract function:", error);
        }

        res.status(201).json({
            status: "SUCCESS",
            message: "Patient signed up successfully",
            data: {
                user: {
                    _id: newPatient._id,
                    name: newPatient.name,
                    email: newPatient.email,
                    age: newPatient.age,
                    gender: newPatient.gender,
                    cnss: newPatient.cnss,
                    role: newPatient.role
                },
                token: token
            }
        });
    } catch (error) {
        console.error("Error signing up patient:", error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error"
        });
    }
});

// Route pour le sign-up des médecins
router.post('/signup-doctor', async (req, res) => {
    try {
        let { name, email, password, age, gender, role, specialization, selectedAccount } = req.body;

        name = name ? name.trim() : '';
        email = email ? email.trim() : '';
        password = password ? password.trim() : '';
        age = age ? age.trim() : '';
        gender = gender ? gender.trim() : '';
        role = role ? role.trim() : '';
        specialization = specialization ? specialization.trim() : '';
        selectedAccount = selectedAccount ? selectedAccount.trim() : '';

        // Check for empty required fields
        if (!name || !email || !password || !age || !gender || !role || !specialization || !selectedAccount) {
            return res.status(400).json({ message: "Veuillez remplir tous les champs" });
        }

        // Check if email is already in use
        const existingDoctor = await User.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ message: "Email déjà utilisé" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new doctor user
        const newDoctor = new User({
            name,
            email,
            password: hashedPassword,
            age,
            gender,
            specialization,
            role
        });

        // Generate a new token upon successful signup
        const token = jwt.sign({ _id: newDoctor._id }, key);

        // Assign the generated token to the user
        newDoctor.token = token;

        // Save the new doctor user to the database
        await newDoctor.save();
        
        const accounts = await web3.eth.getAccounts();
        const gasLimit = 300000; // Set the gas limit to a value higher than the estimated gas cost
        let result ; 
        
        try {
            // Execute the smart contract function
            const result = await contract.methods.executeDoctorSignup(name, email, age, gender, specialization).send({
                from: selectedAccount,
                gas: gasLimit, // Set the gas limit for the transaction
                value: web3.utils.toWei('1', 'ether') // Send 1 ether along with the transaction

            });
            console.log("Transaction successful:", result);
        } catch (error) {
            console.error("Error executing smart contract function:", error);
        }
        console.log("Gas limit:", gasLimit);
        
        
        
                console.log('Smart contract execution result:', result);
        res.status(201).json({
            status: "SUCCESS",
            message: "Doctor signed up successfully",
            data: {
                user: {
                    _id: newDoctor._id,
                    name: newDoctor.name,
                    email: newDoctor.email,
                    age: newDoctor.age,
                    gender: newDoctor.gender,
                    specialization: newDoctor.specialization,
                    role: newDoctor.role
                },
                token: token  // Include the generated token in the response
            }
        });
    } catch (error) {
        console.error("Error signing up Doctor:", error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error"
        });
    }
});

module.exports = router;


/////////////////////sign in
router.post('/login', async (req, res) => {
    let { email, password, selectedAccount } = req.body;

    email = email ? email.trim() : '';
    password = password ? password.trim() : '';


    try {
        // Check empty fields
        if (email === '' || password === '' || !selectedAccount) {
            return res.json({
                status: "FAILED",
                message: "Empty input fields !"
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({
                status: "FAILED",
                message: "Invalid email"
            });
        }

        // Compare user password
        const hashedPassword = user.password;
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (passwordMatch) {
            // Generate a new token upon successful login
            const token = jwt.sign({ _id: user._id, role: user.role }, key);

            // Update the user's token in the database
            user.token = token;
            await user.save();

            const accounts = await web3.eth.getAccounts();
            const gasLimit = 300000;
            
            try {
               
                // Obtenez le prix actuel du gaz en Wei
                const gasPriceWei = await web3.eth.getGasPrice();
            
                // Convertissez le prix du gaz de Wei en Ether
                const gasPriceEth = web3.utils.fromWei(gasPriceWei, 'ether');
            
                // Calculez le coût total du gaz en Ether
                const gasCostEth = gasPriceEth * gasLimit;
            
                // Montant total à envoyer en incluant le coût du gaz
                const totalAmountEth = gasCostEth; //coût du gaz en ETH
                console.log(totalAmountEth);

            
                // Convertissez le montant total en Wei
                const weiAmount = web3.utils.toWei(totalAmountEth.toString(), 'ether');
            
                // Envoyez la transaction en incluant le coût du gaz
                await contract.methods.logUserSignIn(user.name, user.email, user.role).send({
                    from: selectedAccount,
                    gas: gasLimit,
                    value: weiAmount
                });
            
                console.log('Transaction envoyée avec succès.');
            } catch (error) {
                console.error(error);
            }
            

            res.json({
                status: "SUCCESS",
                message: "Signin successful",
                data: {
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role // Include user's role in the response
                    },
                    token: user.token
                }
            });
        } else {
            res.json({
                status: "FAILED",
                message: "Incorrect password"
            });
        }


    } catch (error) {
        console.error(error);
        res.json({
            status: "FAILED",
            message: "An error occurred during login"
        });
    }
});

module.exports = router;