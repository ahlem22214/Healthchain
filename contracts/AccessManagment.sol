// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract AccessManagement {
    // Struct to represent access record
    struct AccessRecord {
        string patientName;
        string doctorId;
        address patientAddress;
            }

             // Struct to store details of revoked access
   // Define a struct to store access revocation records
struct RevokedAccess {
    address patientAddress;
    string patientName;
    string doctorId;
}

// Array to store revoked access records
RevokedAccess[] public revokedAccessRecords;

    // Array to store access records
    AccessRecord[] public accessRecords;

    // Event emitted when access is granted
    event AccessGranted(address patientAddress, string patientName,string doctorId );
    // Event emitted when access is revoked
event AccessRevoked(address indexed patientAddress, string patientName, string doctorId);



    // Function to grant access to a doctor
    function grantAccess(string memory patientName, string memory doctorId ) public payable {
        // Create a new access record instance
        AccessRecord memory newAccessRecord;
        newAccessRecord.patientAddress = msg.sender;
        newAccessRecord.patientName = patientName;
        newAccessRecord.doctorId = doctorId;
       

        // Add the new access record to the array
        accessRecords.push(newAccessRecord);

        // Emit event
        emit AccessGranted(msg.sender, patientName, doctorId);
    }

     // Function to revoke access from a doctor
    function revokeAccess(string memory patientName, string memory doctorId) public payable {
        // Emit an event to indicate access revocation

        RevokedAccess memory newRevokedAccess;
        newRevokedAccess.patientAddress=msg.sender;
        newRevokedAccess.patientName = patientName;
        newRevokedAccess.doctorId = doctorId;

        revokedAccessRecords.push(newRevokedAccess);
        emit AccessRevoked(msg.sender,patientName, doctorId);
        
        // Store the access revocation record in the array
    }
}

