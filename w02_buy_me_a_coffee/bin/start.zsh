cd be

# install back-end deps
npm i

# compile the contract
npx hardhat compile
mkdir -p ../fe/contracts
cp ./artifacts/contracts/CoffeeFund.sol/CoffeeFund.json ../fe/contracts/CoffeeFund.json

# launch the local network
npx hardhat node &

# deploy the contract
sleep 5
npx hardhat run scripts/deploy.js --network localhost

cd ../fe

# install front-end deps
npm i

# launch the front-end server
npx serve .
