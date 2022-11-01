require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

const { POLYGONSCAN_API_KEY, SIGNER_PRIVATE_KEY, TESTNET_RPC } = process.env;

module.exports = {
  solidity: "0.8.17",
  networks: {
    mumbai: {
      url: TESTNET_RPC,
      accounts: [SIGNER_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY,
  },
};
