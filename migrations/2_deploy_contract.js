const NonceNS = artifacts.require("NonceNS");

module.exports = function(deployer) {
  deployer.deploy(NonceNS);
};
