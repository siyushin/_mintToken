# MintToken

forked from https://github.com/siyushin/_mintToken


`MintToken` is an innovative and open-source dapp built on top of [IoTeX](https://iotex.io) blockchain for the issuance of new assets.

## Use

To use it, one has to properly install [ioPay](https://iopay.iotex.io), create an IoTeX account (make sure you have few $IOTX in the account for gas fees) and visit https://minttoken.io. After filling in desired parameters, and clicking `Submit`, `ioPay` will be invoked to deployed the corresponding smart contracts to IoTeX blockchain.

## Develop
This project is built based on the [iotex-dapp-sample](https://github.com/iotexproject/iotex-dapp-sample) framework.

1. To run it locally, one needs to run
```
yarn start
```

2. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits, and you will also see lint errors in the console which don't matter.

3. Edit `/src/config.js` to set IPFS and IoTeX endpoints.

4. Optionally, one uses `yarn build` to build the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

## Deploy

This Dapp can be simply deployed to [Heroku](https://herokuapp.com/). One has to make sure `https://buildpack-registry.s3.amazonaws.com/buildpacks/mars/create-react-app.tgz` is added to `Buildpacks` under `Settings` section.

## Feedback

Feedback and suggestions are welcomed! Please reach out to us on https://community.iotex.io/ !
