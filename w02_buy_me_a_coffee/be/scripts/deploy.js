async function deploy() {
  console.log("Deploying CoffeeFund...");
  const CoffeeFund = await ethers.getContractFactory("CoffeeFund");
  const cf = await CoffeeFund.deploy();
  await cf.deployed();
  console.log(`Deployed CoffeeFund at address ${cf.address}`);
}

deploy()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
