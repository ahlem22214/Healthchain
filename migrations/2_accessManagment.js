// SPDX-License-Identifier: MIT
const AccessManagement = artifacts.require("AccessManagement"); // Update contract name to match artifacts file

module.exports = function(deployer) {
  deployer.deploy(AccessManagement);
};
