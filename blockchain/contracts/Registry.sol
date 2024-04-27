// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Registry {
    // Struct to represent patient details
    struct Patient {
        address patientAddress;
        string name;
        string email;
        string age;
        string gender;
        string role;
        string cnss;
    }

    // Struct to represent doctor details
    struct Doctor {
        address doctorAddress;
        string name;
        string email;
        string age;
        string gender;
        string specialization;
    }
    
    // Array to store sign-in events
    struct SignInEvent {
        address userAddress;
        string name;
        string email;
        string role;
    }

    // Arrays to store patient and doctor details
    Patient[] public patients;
    Doctor[] public doctors;
    SignInEvent[] public signInEvents;


    // Event emitted when a patient signs up
    event PatientSignedUp(address indexed patientAddress, string name, string email, string age, string gender, string role, string cnss);

    // Event emitted when a doctor signs up
    event DoctorSignedUp(address indexed doctorAddress, string name, string email,string age, string gender, string specialization);

        // Event emitted when a user signs in
    event UserSignedIn(address indexed userAddress, string name, string email, string role);




    // Function to allow patients to sign up
    function executePatientSignup(string memory name, string memory email, string memory age, string memory gender, string memory role, string memory cnss) public payable {

        // Create a new patient instance
        Patient memory newPatient;
        newPatient.patientAddress = msg.sender;
        newPatient.name = name;
        newPatient.email = email;
        newPatient.age = age;
        newPatient.gender = gender;
        newPatient.role = role;
        newPatient.cnss = cnss;

        // Add the new patient to the array
        patients.push(newPatient);

        // Emit event
        emit PatientSignedUp(msg.sender, name, email, age, gender, role, cnss);
    }

    // Function to allow doctors to sign up
    function executeDoctorSignup(string memory name, string memory email,string memory age, string memory gender, string memory specialization) public payable {

        // Create a new doctor instance
        Doctor memory newDoctor;
        newDoctor.doctorAddress = msg.sender;
        newDoctor.name = name;
        newDoctor.email = email;
        newDoctor.age = age;
        newDoctor.gender = gender;
        newDoctor.specialization = specialization;

        // Add the new doctor to the array
        doctors.push(newDoctor);

        // Emit event
        emit DoctorSignedUp(msg.sender, name, email, age, gender, specialization);
    }

     // Function to log user sign-in
    function logUserSignIn(string memory name, string memory email, string memory role) public payable {


    // Create a new sign-in event
    SignInEvent memory newSignInEvent;
    newSignInEvent.userAddress = msg.sender;
    newSignInEvent.name = name;
    newSignInEvent.email = email;
    newSignInEvent.role = role;

    // Add the new sign-in event to the array
    signInEvents.push(newSignInEvent);

    // Emit event
    emit UserSignedIn(msg.sender, name, email, role);

}

}
