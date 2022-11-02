# Road to Web3

This repo contains my solutions to the Alchemy's 10 week course "Road to Web3".

## Table of Contents

1. Week 1: How to Develop an NFT Smart Contract
2. Week 2: How to build a "Buy me a coffee" DeFi Dapp
3. Week 3: How to Make NFTs with On-Chain Metadata
4. Week 4: Create a NFT Gallery
5. ...

## Week 1: How to Develop an NFT Smart Contract

Developed an NFT smart contract that stores metadata on IPFS (via Filebase).

### Technologies

- Solidity
- Hardhat
- OpenZeppelin (ERC721, ...)
- Alchemy, Alchemy's Goerli faucet
- Ethereum, Goerli testnet
- Metamask
- OpenSea (testnets)
- Filebase (IPFS pinning service)

## [Week 2: How to Build a "Buy Me a Coffee" DeFi Dapp](./w02_buy_me_a_coffee/README.md)

The "Buy Me a Coffee" / "Coffee fund" dapp allows the contract owner to collect and withdraw crypto, while other users can donate 1, 2 or 3 coffees worth `0.01ETH` each.

### Technologies

- Solidity
- OpenZeppelin (Ownable)
- ethers.js
- Hardhat
- Mocha, Chai (contract tests)
- HTML, CSS & JavaScript

## Week 3: How to Make NFTs with On-Chain Metadata

An account owner can deploy the `BJJAvatars` contract, that allows minting of initials avatars, e.g. `NV`, that reflect the belt color of the owner.

All the new NFTs start from the `white` belt. By calling `promote(uint256 tokenId)`, the contract owner can promote the avatar to the next belt, e.g. from `white` to `blue`, from `black` to `red`.

### Technologies

- Solidity
- OpenZeppelin (ERC721, Ownable, utils, ...)
- ethers.js
- Hardhat
- Alchemy (Polygon Mumbai, JsonRPC endpoint)
- Polygonscan (tesnet)

## Week 4: Create a NFT Galery

Explore NFTs by owner, by owner and collection, or by collection only.

### Technologies

- Alchemy NFT API
- Next.js
- Tailwind CSS
- HTML, CSS & Javascript
