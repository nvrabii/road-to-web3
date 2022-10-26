async function main() {
  const RegularCollection = await ethers.getContractFactory(
    "RegularCollection"
  );
  console.log("Attaching RegularCollection...");
  const regularCollection = await RegularCollection.attach(
    "0xcdfA88114eA92eCc6463c0Ea52742F2108eFb658"
  );

  const address = "0x214E833996e4e8f5Ad186c4B7E6e1F0339E95548";
  const uri =
    "https://ipfs.filebase.io/ipfs/QmUe4pL6F9shPPWcC2HLuM54wV7wrM4ZjPwEA9Y9XWnuvU";

  await regularCollection.safeMint(address, uri);
  console.log(`NFT minted`);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
