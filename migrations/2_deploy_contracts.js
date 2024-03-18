var Coin = artifacts.require("Coin");

module.exports = function (deployer) {
  deployer.deploy(Coin, "Coin", "C", "100000000000000000000000");
};
