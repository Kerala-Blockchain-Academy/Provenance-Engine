// const assert = require('assert');
// const ganache = require('ganache-cli');
// const Web3 = require('web3');
// const web3 = new Web3(ganache.provider());
// const json = require('./contracts/Supplychain.json');

import {assert} from "assert";
// import {ganache} from "ganache";
import SupplychainContract from "./contracts/Supplychain.json";
import getWeb3 from "./utils/getWeb3";
const web3 = getWeb3();
// const web3 = new Web3(ganache.provider());

let accounts;
let contract;
let owner;
let productId;
let productOwner;
let supplierAddress;
let supplyChain;
const interfaces = SupplychainContract['abi'];
const bytecodes = SupplychainContract['bytecode'];

beforeEach(async () => {
accounts = await web3.eth.getAccounts();
supplyChain = await new web3.eth.Contract(interfaces)
.deploy({ data: bytecodes })
.send({ from: accounts[0], gas: '1000000' });
});

describe('SupplyChain', () => {

it('supplierAddress', async () => {
let testsupplier = {accounts[1], accounts[2]}
let productOwner = accounts[0]
await supplychain.methods.product(1,[accounts[1], accounts[2]], accounts[3])
.send({ from: accounts[0] });
supplierAddress = await supplychain.methods.supplierAddress().call();
assert.equal(testsupplier, supplierAddress, 'suppliers not same');
});
})