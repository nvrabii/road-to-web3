const { expect } = require("chai");

describe("CoffeeFund", () => {
  let contract;
  let owner;
  let donator;

  before(async () => {
    const CoffeeFund = await ethers.getContractFactory("CoffeeFund");
    contract = await CoffeeFund.deploy();
    await contract.deployed();

    [owner, donator] = await ethers.getSigners();
  });

  it("disallows withdraw from an empty fund", async () => {
    try {
      await contract.connect(owner).withdraw();
      expect(true).false;
    } catch (_) {}
  });

  it("allows valid deposit", async () => {
    const amount = "10.0";
    await contract.connect(donator).buyCoffee("John", "Hello there", {
      value: ethers.utils.parseEther(amount),
    });

    const balance = await ethers.provider.getBalance(contract.address);

    expect(ethers.utils.formatEther(balance)).equals(amount);
    // check event
  });

  it("disallows empty deposit", async () => {
    try {
      await contract.connect(donator).buyCoffee("Boris", "Nah");
      expect(true).false;
    } catch (_) {}
  });

  it("allows withdraw from topped up fund", async () => {
    await contract.connect(owner).withdraw();

    const balance = await ethers.provider.getBalance(contract.address);

    expect(parseInt(balance)).equals(0);
    // check event
  });

  it("gets memos", async () => {
    const [memo] = await contract.getMemos();

    expect(memo.sender).equals(donator.address);
    expect(ethers.utils.formatEther(memo.amount)).equals("10.0");
    expect(memo.from).equals("John");
    expect(memo.message).equals("Hello there");
  });
});
