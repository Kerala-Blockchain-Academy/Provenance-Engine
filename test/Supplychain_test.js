const assert = require("assert");
const supplychain = artifacts.require('../contracts/Supplychain.sol');

let supplyChain;
let testSuppliers;
let owner;
let productOwner;
let productId;

contract('supplychain_pass_tests', (accounts) => {
    beforeEach(async () => {
        supplyChain = await supplychain.deployed();
        testSuppliers = [accounts[1], accounts[2]];
        owner = accounts[0];
        productOwner = accounts[3];
        productId = 1;
        await supplyChain.product(productId, testSuppliers, productOwner, {from: owner});
    });
    // The Test must be Passed.
    it('productExistTest', async () => {
        let expectedProductExists = true;
        let actualProductExists = await supplyChain.productexist(productId);
        assert.equal(actualProductExists, expectedProductExists, 'Product Existence Test Failed');
    });
    // The Test must be Passed.
    it('productSuppliersAddressTest', async () => {
        let suppliersInfo = await supplyChain.getSuppliersOfProduct(productId);
        let expectedNumOfSuppliers = 3;
        let actualNumOfSuppliers = suppliersInfo[1];
        let expectedSupplier1 = accounts[1];
        let actualSupplier1 = suppliersInfo[0][0];
        let expectedSupplier2 = accounts[2];
        let actualSupplier2 = suppliersInfo[0][1];
        let expectedProductOwner = accounts[3];
        let actualProductOwner = suppliersInfo[0][2];
        assert.equal(actualNumOfSuppliers, expectedNumOfSuppliers, 'Suppliers Array Length Test Failed');
        assert.equal(actualSupplier1, expectedSupplier1, 'Supplier 1 Address Match Test Failed');
        assert.equal(actualSupplier2, expectedSupplier2, 'Supplier 2 Address Match Test Failed');
        assert.equal(actualProductOwner, expectedProductOwner, 'Product Owner Address Match Test Failed');
    });
    // The Test must be Passed.
    it('productHandoverTest', async () => {
        await supplyChain.producthandover(productId, 0, 9, 'abc', {from: accounts[1]});
        let productHandover = await supplyChain.viewsupplierinfo(productId, 0);
        let expectedSenderAddress = accounts[1];
        let actualSenderAddress = productHandover[0];
        let expectedSupplierSEScore = 9;
        let actualSupplierSEScore = productHandover[1];
        let expectedIpfsHash = 'abc';
        let actualIpfsHash = productHandover[2]
        assert.equal(actualSenderAddress, expectedSenderAddress, 'Product Handover Sender Address Match Test Failed');
        assert.equal(actualSupplierSEScore, expectedSupplierSEScore, 'Product Handover SE Score Match Test Failed');
        assert.equal(actualIpfsHash, expectedIpfsHash, 'Product Handover IPFS Hash Match Test Failed');
    });
    // The Test must be Passed.
    it('productPublishTest', async() => {
        await supplyChain.producthandover(productId, 0, 9, 'abc', {from: accounts[1]});
        await supplyChain.producthandover(productId, 1, 10, 'bcd', {from: accounts[2]});
        await supplyChain.producthandover(productId, 2, 11, 'efg', {from: accounts[3]});
        await supplyChain.publishproductrecords(productId, {from: accounts[3]});
        let publishStatus = await supplyChain.checkPublishStatus(productId);
        let productInfo = await supplyChain.viewproductownerinfo(productId);
        let expectedPublishStatus = true;
        let actualpublishStatus = publishStatus;
        let expectedProductOwner = accounts[3];
        let actualProductOwner = productInfo[0];
        let expectedFinalSEScore = 10;
        let actualFinalSEScore = productInfo[1];
        assert.equal(actualpublishStatus, expectedPublishStatus, 'Product Publish Status Test Failed');
        assert.equal(actualProductOwner, expectedProductOwner, 'Product Publish Product Owner Address Match Test Failed');
        assert.equal(actualFinalSEScore, expectedFinalSEScore, 'Product Publish Final SE Match Test Failed');
    });
});