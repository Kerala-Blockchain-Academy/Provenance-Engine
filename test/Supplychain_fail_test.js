const assert = require("assert");
const supplychain = artifacts.require('../contracts/Supplychain.sol');

let supplyChain;
let testSuppliers;
let owner;
let productOwner;
let productId;

contract('supplychain_fail_tests', (accounts) => {
    beforeEach(async () => {
        supplyChain = await supplychain.deployed();
        testSuppliers = [accounts[1], accounts[2]];
        owner = accounts[0];
        productOwner = accounts[3];
        productId = 1;
        await supplyChain.product(productId, testSuppliers, productOwner, {from: owner});
    });
    // The Test must be Failed.
    it('productExistFailTest', async () => {
        let expectedProductId = 2;
        let expectedProductExists = true;
        let actualProductExists = await supplyChain.productexist(expectedProductId);
        assert.equal(actualProductExists, expectedProductExists, 'Product Existence Test Must Fail');
    });
    // The Test must be Failed.
    it('productSuppliersAddressArrayLengthMismatchTest', async () => {
        let suppliersInfo = await supplyChain.getSuppliersOfProduct(productId);
        let expectedNumOfSuppliers = 4;
        let actualNumOfSuppliers = suppliersInfo[1];
        assert.equal(actualNumOfSuppliers, expectedNumOfSuppliers, 'Suppliers Array Length Test Must Fail Due To Array Length Mismatch');
    });
    // The Test must be Failed.
    it('productHandoverAccountMismatchTest', async () => {
        await supplyChain.producthandover(productId, 0, 9, 'abc', {from: accounts[1]});
        let productHandover = await supplyChain.viewsupplierinfo(productId, 0);
        let expectedSenderAddress = accounts[0];
        let actualSenderAddress = productHandover[0];
        assert.equal(actualSenderAddress, expectedSenderAddress, 'Product Handover Sender Address Match Test Must Fail Due To Address Mismatch');
    });
    // The Test must be Failed.
    it('productHandoverSEScoreMismatchTest', async () => {
        await supplyChain.producthandover(productId, 0, 9, 'abc', {from: accounts[1]});
        let productHandover = await supplyChain.viewsupplierinfo(productId, 0);
        let expectedSupplierSEScore = 10;
        let actualSupplierSEScore = productHandover[1];
        assert.equal(actualSupplierSEScore, expectedSupplierSEScore, 'Product Handover SE Score Match Test Must Fail Due To SE Score Mismatch');
    });
    // The Test must be Failed.
    it('productHandoverIPFSHashMismatchTest', async () => {
        await supplyChain.producthandover(productId, 0, 9, 'abc', {from: accounts[1]});
        let productHandover = await supplyChain.viewsupplierinfo(productId, 0);
        let expectedIpfsHash = 'bcd';
        let actualIpfsHash = productHandover[2];
        assert.equal(actualIpfsHash, expectedIpfsHash, 'Product Handover IPFS Hash Match Test Must Fail Due To IPFS Hash Mismatch');
    });
    // The Test must be Failed.
    it('productPublishProductOwnerAddressMismatchTest', async() => {
        await supplyChain.producthandover(productId, 0, 9, 'abc', {from: accounts[1]});
        await supplyChain.producthandover(productId, 1, 10, 'bcd', {from: accounts[2]});
        await supplyChain.producthandover(productId, 2, 11, 'efg', {from: accounts[3]});
        await supplyChain.publishproductrecords(productId, {from: accounts[3]});
        let productInfo = await supplyChain.viewproductownerinfo(productId);
        let expectedProductOwner = accounts[0];
        let actualProductOwner = productInfo[0];
        assert.equal(actualProductOwner, expectedProductOwner, 'Product Publish Product Owner Address Match Test Failed');
    });
    // The Test must be Failed.
    it('productPublishFinalSEScoreMismatchTest', async() => {
        await supplyChain.producthandover(productId, 0, 9, 'abc', {from: accounts[1]});
        await supplyChain.producthandover(productId, 1, 10, 'bcd', {from: accounts[2]});
        await supplyChain.producthandover(productId, 2, 11, 'efg', {from: accounts[3]});
        await supplyChain.publishproductrecords(productId, {from: accounts[3]});
        let productInfo = await supplyChain.viewproductownerinfo(productId);
        let expectedFinalSEScore = 12;
        let actualFinalSEScore = productInfo[1];
        assert.equal(actualFinalSEScore, expectedFinalSEScore, 'Product Publish Final SE Match Test Failed');
    });
});