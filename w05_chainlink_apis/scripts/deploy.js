const { ethers } = require("hardhat");

async function deploy() {
  const HodlPunks = await ethers.getContractFactory("HodlPunks");
  console.log("deploying...");
  const contract = await HodlPunks.deploy(
    "0x007A22900a3B98143368Bd5906f8E17e9867581b",
    "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
    20
  );
  await contract.deployed();
  console.log(`HodlPunks deployed at ${contract.address}`);
}

deploy()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
