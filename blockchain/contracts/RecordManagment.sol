// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


contract RecordManagment {
    struct DiagnosisRecord {
        address doctorAddress;
        string doctorId;
        string patientId;
        string Diagnosis;
        string Details;

    }

    DiagnosisRecord[] public diagnosisRecords;

    event DiagnosisRecordAdded(address indexed doctorAddress,string doctorId , string patientId, string Diagnosis, string Details);

    function addDiagnosisRecord(string memory doctorId, string memory patientId, string memory Diagnosis, string memory Details) public payable {
        DiagnosisRecord memory newRecord;
        newRecord.doctorAddress=msg.sender;
        newRecord.doctorId = doctorId;
        newRecord.patientId = patientId;
        newRecord.Diagnosis = Diagnosis;
        newRecord.Details = Details;




        diagnosisRecords.push(newRecord);
        emit DiagnosisRecordAdded(msg.sender, doctorId, patientId, Diagnosis, Details);
    }
}