const { ethers } = require("hardhat");

async function deploy() {
  const BJJAvatars = await ethers.getContractFactory("BJJAvatars");
  const contract = await BJJAvatars.deploy();
  await contract.deployed();
  console.log(`BJJAvatars contract deployed at: ${contract.address}`);
}

deploy()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
