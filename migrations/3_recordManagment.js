const RecordManagment = artifacts.require("RecordManagment"); // Update contract name to match artifacts file

module.exports = function(deployer) {
  deployer.deploy(RecordManagment);
};
