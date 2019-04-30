# React Truffle Box

This box comes with everything you need to start using smart contracts from a react app. This is as barebones as it gets, so nothing stands in your way.

## Installation (Ubuntu Systems)

After cloning the contents from gitlab, access the directory and install the following packages and follow the below instructions as required.


1. Run the `install` commands for installing nodejs and npm.

	(a) Adding PPA for stable nodejs version.
             curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -

	(b) Installing Nodejs and NPM.
             sudo apt install nodejs

	(c) To check versions of nodejs and npm.
             node -v
             npm -v


2. Run the `install` commands for installing ganache-cli.

    npm install -g ganache-cli


3. You have to install Truffle globally.

    npm install -g truffle


4. Run `npm install` from both Root and Client folders to install the npm dependencies.


5. Run the development console.

    truffle develop


6. Compile and migrate the smart contracts. Note inside the development console we don't preface commands with `truffle`.

    compile
    migrate


7. In the `client` directory, we run the React app. Smart contract changes must be manually recompiled and migrated.

    // in another terminal (i.e. not in the truffle develop prompt)
    cd client
    npm start


8. Truffle can run tests written in Solidity or JavaScript against your smart contracts. Note the command varies slightly if you're in or outside of the development console.

    // inside the development console.
    test

    // outside the development console..
    truffle test



## Available Scripts in client

In the project (client) directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.



## FAQ

* __How do I use this with the Ganache-CLI?__

    It's as easy as modifying the config file! [Check out our documentation on adding network configurations](http://truffleframework.com/docs/advanced/configuration#networks). Depending on the port you're using, you'll also need to update line 29 of `client/src/utils/getWeb3.js`.

* __Where is my production build?__

    The production build will be in the `client/build` folder after running `npm run build` in the `client` folder.

* __Where can I find more documentation?__

    This box is a marriage of [Truffle](http://truffleframework.com/) and a React setup created with [create-react-app](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md). Either one would be a great place to start!


## PRIVATE NODE SETUP

1. Install Geth

2. Access the geth folder and initiate the genesis file
   geth --datadir node init genesis.json 

3. Initiate and Run the Private Ethereum Blockchain   
   geth --port 3001 --networkid 58343 --nodiscover --datadir=./node --maxpeers=0  --rpc --rpcport 8545 --ipcpath "~/.ethereum/geth.ipc" --rpcaddr 127.0.0.1 --rpccorsdomain "*" --rpcapi "eth,net,web3,personal,miner"

4. Connect to the private Ethereum blockchain using the Geth Javascript console
   geth attach http://127.0.0.1:8545   

5. Create an account and “mine” for dummy Ether 
   > personal.newAccount('seed')
   > personal.unlockAccount(web3.eth.coinbase, "seed", 15000)   
   > miner.start()

6. Run the following command from the root folder
   $ truffle migrate --reset

7. Import the account to metamask(make sure the chain id and rpc port is same as that of the private blockchain)
   
8. Backup file of the Private chain is provided under the geth folder along with the paper Wallet for the account[0]
   The password for the wallet account is "seed".

   
