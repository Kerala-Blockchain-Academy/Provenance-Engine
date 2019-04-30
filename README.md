# Provenance-Engine
Product provenance through Supply-chain management.

## Installation (Ubuntu Systems)

After cloning the contents from gitlab, access the directory and install the following packages and follow the below instructions as required.

This project is developed on Nodejs, truffle and React Frameworks. Follow the below instruction to install required frameworks and tools for running the project.  


1. Run the `install` commands for installing nodejs and npm.

	(a) Adding PPA for stable nodejs version.<br>
             `$ curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -`

	(b) Installing Nodejs and NPM.<br>
             `$ sudo apt install nodejs`

	(c) To check versions of nodejs and npm.<br>
             `$ node -v` <br>
             `$ npm -v`


2. Run the `install` commands for installing ganache-cli.<br>

    `$ npm install -g ganache-cli`


3. You have to install Truffle globally.<br>

    `$ npm install -g truffle`


## Initialize Project

1. Run `$ npm install` from both Root project folder and Client folder to install the npm dependencies.

2. Run the development console.<br>
    `$ truffle develop`

3. Open another Terminal in Root Project Folder. Compile and migrate the smart contracts. <br>
    `$ compile`<br>
    `$ migrate`

4. In the `client` directory, we run the React app. <br>
    `$ cd client` <br>
    `$ npm start`
    
## Note: working demo and documentations are available in this project.
