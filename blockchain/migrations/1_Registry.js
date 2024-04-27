// SPDX-License-Identifier: MIT
const Registry = artifacts.require("./Registry.sol"); // Update contract name to match artifacts file

module.exports = function(deployer) {
  deployer.deploy(Registry);
};
