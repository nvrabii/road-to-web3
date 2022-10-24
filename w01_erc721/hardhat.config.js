require("@nomiclabs/hardhat-ethers");
const { alchemyApiKey, mnemonic } = require("./secrets.json");

module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${alchemyApiKey}`,
      accounts: { mnemonic },
    },
  },
};
