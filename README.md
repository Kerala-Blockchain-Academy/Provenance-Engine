# Provenance-Engine #
Product provenance through Supply-chain management.

## Installation (Ubuntu Systems)##

After cloning the contents from gitlab, access the directory and install the following packages and follow the below instructions as required.

This project is developed on Nodejs, truffle and React Frameworks. Follow the below instruction to install required frameworks and tools for running the project.  

1. Run the `install` commands for installing nodejs and npm.
(a) Adding PPA for stable nodejs version.
``` 
curl -sL https://deb.nodesource.com/setup_10.x | sudo bash - 
```
(b) Installing Nodejs and NPM.
``` 
sudo apt install nodejs
```
(c) To check versions of nodejs and npm.
``` 
node -v
```
```
npm -v
```
2. Run the `install` commands for installing ganache-cli.<br>

```
$ npm install -g ganache-cli
```
3. You have to install Truffle globally.<br>
```
$ npm install -g truffle
```
### Initialize Project ###

1. Run the following command from both Root project folder and Client folder to install the npm dependencies.
```
npm install
```
2. Run the development console.
```
truffle develop
```
3. Open another Terminal in Root Project Folder. Compile and migrate the smart contracts.
```
compile
migrate
```

4. In the `client` directory, we run the React app. <br>
```
cd client
npm start`
```    
#### Note: working demo and documentations are available in this project####
