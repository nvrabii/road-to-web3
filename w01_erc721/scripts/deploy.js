async function deploy() {
  const RegularCollection = await ethers.getContractFactory(
    "RegularCollection"
  );
  console.log("Deploying RegularCollection...");
  const regularCollection = await RegularCollection.deploy();
  await regularCollection.deployed();
  console.log(`RegularCollection deployed to ${regularCollection.address}`);
}

deploy()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
