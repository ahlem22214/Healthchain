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
const contractABI = require('../../blockchain/build/contracts/Registry.json');

// Initialize web3 provider (e.g., connecting to Ganache)
const web3 = new Web3('http://localhost:8545');

// Set up contract instance
const contractAddress = '0xa8A9C682aAC2c2722013a5988C7bD9D5e0d034f9'; // Address of your deployed smart contract
const contract = new web3.eth.Contract(contractABI.abi, contractAddress);


router.post('/signup-patient', async (req, res) => {
    try {
        // Extract signup data and selected account address from request body
        let { name, email, password, age, gender, role, cnss, accountAddress } = req.body;

        // Trim whitespace from input fields
        name = name ? name.trim() : '';
        email = email ? email.trim() : '';
        password = password ? password.trim() : '';
        age = age ? age.trim() : '';
        gender = gender ? gender.trim() : '';
        role = role ? role.trim() : '';
        cnss = cnss ? cnss.trim() : '';
        accountAddress = accountAddress ? accountAddress.trim() : '';

        // Check for empty required fields
        if (!name || !email || !password || !age || !gender || !role || !cnss ) {
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
        // Check if the account address is already associated with another user
        const existingAccount = await User.findOne({ accountAddress: accountAddress });
        if (existingAccount) {
            return res.json({
                status: "FAILED",
                message: "Account address already associated with another user"
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
            cnss,
            accountAddress
        });

        // Generate a new token upon successful signup
        const token = jwt.sign({ _id: newPatient._id }, key);

        // Assign the generated token to the user
        newPatient.token = token;

        // Save the new patient user to the database
        await newPatient.save();
        let result;

        // Execute the smart contract function after patient signup
        try {
            // Get the current gas price
            const gasPriceWei = await web3.eth.getGasPrice();
                
            // Estimate gas cost for the transaction
            const gasEstimate = await contract.methods.executePatientSignup(name, email, age, gender, role, cnss).estimateGas({ from: accountAddress });
            
            // Calculate total gas cost in ETH
            const gasCostEth = web3.utils.fromWei((gasPriceWei * gasEstimate).toString(), 'ether');
        
            // Calculate the value to be sent (excluding gas cost)
            const valueEth = 0; // You can set the value to be sent here
            
            // Calculate total amount to be sent (including gas cost)
            const totalAmountEth = parseFloat(gasCostEth) + parseFloat(valueEth);
        
            // Convert the total amount to Wei
            const weiAmount = web3.utils.toWei(totalAmountEth.toString(), 'ether');
            const ethAmount = web3.utils.fromWei(weiAmount, 'ether');

        
            // Prepare the transaction data
            const transactionData = {
                from: accountAddress,
                gas: gasEstimate,
                gasPrice: gasPriceWei,
                value: weiAmount // Include the value to be sent
            };

            // Send the transaction
            const transactionReceipt = await contract.methods.executePatientSignup(name, email, age, gender, role, cnss).send(transactionData);
            
            console.log(ethAmount);

            
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
                    role: newPatient.role,
                    accountAddress: newPatient.accountAddress // Include the account address in the response

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
        let { name, email, password, age, gender, role, specialization, accountAddress } = req.body;

        name = name ? name.trim() : '';
        email = email ? email.trim() : '';
        password = password ? password.trim() : '';
        age = age ? age.trim() : '';
        gender = gender ? gender.trim() : '';
        role = role ? role.trim() : '';
        specialization = specialization ? specialization.trim() : '';
        accountAddress = accountAddress ? accountAddress.trim() : '';

        // Check for empty required fields
        if (!name || !email || !password || !age || !gender || !role || !specialization ) {
            return res.status(400).json({ message: "Veuillez remplir tous les champs" });
        }

        // Check if email is already in use
        const existingDoctor = await User.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ message: "Email already exists" });
        }

         // Check if the account address is already associated with another user
     // Check if the account address is already associated with another user
     const existingAccount = await User.findOne({ accountAddress: accountAddress });
     if (existingAccount) {
         return res.json({
             status: "FAILED",
             message: "Account address already associated with another user"
         });
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
            role,
            accountAddress
        });

        // Generate a new token upon successful signup
        const token = jwt.sign({ _id: newDoctor._id }, key);

        // Assign the generated token to the user
        newDoctor.token = token;

        // Save the new doctor user to the database
        await newDoctor.save();
        
        const accounts = await web3.eth.getAccounts();
        let result ; 
        
        try {
             // Get the current gas price
             const gasPriceWei = await web3.eth.getGasPrice();
                
             // Estimate gas cost for the transaction
             const gasEstimate = await contract.methods.executeDoctorSignup(name, email, age, gender, specialization).estimateGas({ from: accountAddress });
             
             // Calculate total gas cost in ETH
             const gasCostEth = web3.utils.fromWei((gasPriceWei * gasEstimate).toString(), 'ether');
         
             // Calculate the value to be sent (excluding gas cost)
             const valueEth = 0; // You can set the value to be sent here
             
             // Calculate total amount to be sent (including gas cost)
             const totalAmountEth = parseFloat(gasCostEth) + parseFloat(valueEth);
         
             // Convert the total amount to Wei
             const weiAmount = web3.utils.toWei(totalAmountEth.toString(), 'ether');
             const ethAmount = web3.utils.fromWei(weiAmount, 'ether');

         
             // Prepare the transaction data
             const transactionData = {
                 from: accountAddress,
                 gas: gasEstimate,
                 gasPrice: gasPriceWei,
                 value: weiAmount // Include the value to be sent
             };

             // Send the transaction
             const transactionReceipt = await contract.methods.executeDoctorSignup(name, email, age, gender, specialization).send(transactionData);
             
             console.log(ethAmount);

        
            console.log("Transaction successful:", result);
        } catch (error) {
            console.error("Error executing smart contract function:", error);
        }
        
        
        
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
                    role: newDoctor.role,
                    accountAddress: newDoctor.accountAddress // Include the account address in the response

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
    let { email, password, accountAddress } = req.body;

    email = email ? email.trim() : '';
    password = password ? password.trim() : '';
    accountAddress = accountAddress ? accountAddress.trim() : '';



    try {
        // Check empty fields
        if (email === '' || password === '' ) {
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
            // Check if the selected account matches the one associated with the user
            if (user.accountAddress !== accountAddress) {
                return res.json({
                    status: "FAILED",
                    message: "Selected account does not match the one associated with the user"
                });
            }
            // Generate a new token upon successful login
            const token = jwt.sign({ _id: user._id, role: user.role }, key);

            // Update the user's token in the database
            user.token = token;
            await user.save();

            const accounts = await web3.eth.getAccounts();
            
            try {
                // Get the current gas price
                const gasPriceWei = await web3.eth.getGasPrice();
                
                // Estimate gas cost for the transaction
                const gasEstimate = await contract.methods.logUserSignIn(user.name, user.email, user.role).estimateGas({ from: accountAddress });
                
                // Calculate total gas cost in ETH
                const gasCostEth = web3.utils.fromWei((gasPriceWei * gasEstimate).toString(), 'ether');
            
                // Calculate the value to be sent (excluding gas cost)
                const valueEth = 0; // You can set the value to be sent here
                
                // Calculate total amount to be sent (including gas cost)
                const totalAmountEth = parseFloat(gasCostEth) + parseFloat(valueEth);
            
                // Convert the total amount to Wei
                const weiAmount = web3.utils.toWei(totalAmountEth.toString(), 'ether');
                const ethAmount = web3.utils.fromWei(weiAmount, 'ether');

            
                // Prepare the transaction data
                const transactionData = {
                    from: accountAddress,
                    gas: gasEstimate,
                    gasPrice: gasPriceWei,
                    value: weiAmount // Include the value to be sent
                };

                // Send the transaction
                const transactionReceipt = await contract.methods.logUserSignIn(user.name, user.email, user.role).send(transactionData);
                
                console.log('Transaction sent successfully.');
                console.log('Transaction envoyée avec succès.');
                console.log(ethAmount);

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