const { expect } = require("chai");

describe("CoffeeFund", () => {
  let CoffeeFund;
  let contract;
  let owner;
  let donator;

  before(async () => {
    CoffeeFund = await ethers.getContractFactory("CoffeeFund");
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
    const from = "John";
    const message = "Hello there";

    const tx = await contract.connect(donator).buyCoffee(from, message, {
      value: ethers.utils.parseEther(amount),
    });
    const { logs } = await tx.wait();
    const [log] = logs.map((log) => CoffeeFund.interface.parseLog(log));

    const balance = await ethers.provider.getBalance(contract.address);

    expect(ethers.utils.formatEther(balance)).equals(amount);

    expect(log.name).equals("CoffeeBought");
    expect(log.args[0]).equals(donator.address);
    expect(ethers.utils.formatEther(log.args[1])).equals(amount);
    expect(log.args[2]).equals(from);
    expect(log.args[3]).equals(message);
  });

  it("disallows empty deposit", async () => {
    try {
      await contract.connect(donator).buyCoffee("Boris", "Nah");
      expect(true).false;
    } catch (_) {}
  });

  it("allows withdraw from topped up fund", async () => {
    const tx = await contract.connect(owner).withdraw();
    const { logs } = await tx.wait();
    const [log] = logs.map((log) => CoffeeFund.interface.parseLog(log));

    const balance = await ethers.provider.getBalance(contract.address);

    expect(parseInt(balance)).equals(0);
    expect(log.name).equals("CoffeeFundWithdrawn");
    expect(ethers.utils.formatEther(log.args[0])).equals("10.0");
  });

  it("gets memos", async () => {
    const [memo] = await contract.getMemos();

    expect(memo.sender).equals(donator.address);
    expect(ethers.utils.formatEther(memo.amount)).equals("10.0");
    expect(memo.from).equals("John");
    expect(memo.message).equals("Hello there");
  });
});
