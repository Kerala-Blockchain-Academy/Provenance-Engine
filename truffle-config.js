const path = require("path");
var HDWalletProvider = require("truffle-hdwallet-provider");

var infura_apikey = "https://ropsten.infura.io/v3/9c14f625b3da4c9a91e94a90adf0db15";
var mnemonic = "have proud fence wedding spike unfair mass shield inform wear scissors equip";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  rpc: {
    host:"localhost",
    port:9545
    },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*" // Match any network id
      // from: "0xbe9872d96843256457a3efa37b616a440d7f3ea5"
    },
    ropsten: {
      provider: new HDWalletProvider( mnemonic, infura_apikey ),
      network_id: 3
    }
  }
};
