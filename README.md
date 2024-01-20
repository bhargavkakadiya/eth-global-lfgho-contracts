# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

## Clean Repo

```shell
rm tests/*
rm scripts/*
rm contracts/*
yarn hardhat clean
```

Some Commands to test

```shell
yarn hardhat help
yarn hardhat test
REPORT_GAS=true npx hardhat test
yarn hardhat node
yarn hardhat run scripts/deploy.ts
```

## To Deploy on Goerli

```bash
yarn hardhat run scripts/deploy.ts --network goerli # deploy
yarn hardhat verify --network goerli <contract addr> # verify on etherscan
```
