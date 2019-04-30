pragma solidity >0.4.0 <0.6.0;

contract Supplychain {

    address public owner;
    uint8    i = 0;
    uint    numofsuppliers;
    
    event ProductAdded(uint productid, address productowner);
    event Handover(uint productid, address supplierAddress, uint ser, string ipfs);
    event Published(uint productid, address productOwner, uint finalSE);
    
    struct  supplier_struct{
        uint8    SEscore;
        string  ipfsHash;
    }
    
    mapping (uint8 => mapping( uint8 => supplier_struct)) product_SE;
    mapping (uint8 => uint) countofsuppliers;
    mapping (uint8 => uint) finalSE;
    mapping (uint8 => address[]) productsupplychain;
    mapping (uint8 => address) productowner;
    mapping (uint8 => bool) cyclecomplete;
    mapping (uint8 => bool) published;
    
    constructor() public{
        owner = msg.sender;
    }
    
    // check if the owner is the current user
    modifier onlyowner {
        require(msg.sender == owner, "Error: This operation is only for the Owner!");
        _;
    }
    
    // Update Product info to blockchain. Only accessible to admin.
    function product(uint8 productid, address[] memory supplieraddress, address _productowner) public onlyowner {
        productowner[productid] = _productowner;
        productsupplychain[productid] = (supplieraddress);
        // Adding Product owner to the suppliers array, so that we can get the owner info 
        // and also, include the owner to the final SE calculation.
        productsupplychain[productid].push(_productowner);
        numofsuppliers = productsupplychain[productid].length;
        emit ProductAdded(productid, productowner[productid]);
    }

    // To view the number of suppliers and their wallet addresses.
    function getSuppliersOfProduct(uint8 productid) public view returns(address[] memory, uint) {
        return(productsupplychain[productid], numofsuppliers);
    }
    
    // The below function is to update the information of the component delivered by each supplier
    // and also for the product owner to update their own information for the product.
    function producthandover(uint8 productid,uint8 _index, uint8 _SEscore, string memory _ipfsHash) public {
        require(productsupplychain[productid][_index]==msg.sender, "Not a supplier of this product supplychain");
        product_SE[productid][_index].SEscore = _SEscore;
        product_SE[productid][_index].ipfsHash = _ipfsHash;
        // A cycle is completed by the product owner.
        if(msg.sender == productowner[productid]){
            cyclecomplete[productid] = true;
        }
        // Trigger event to transfer
        emit Handover(
            productid, 
            productsupplychain[productid][_index], 
            product_SE[productid][_index].SEscore, 
            product_SE[productid][_index].ipfsHash
        );
    }
    
    // To publish the final SE score of the product.
    function publishproductrecords(uint8 productid) public {
        require(productowner[productid] == msg.sender, "Sorry, you are not the product owner of this product");
        finalSE[productid] = 0;
        for(i = 0; i<numofsuppliers; i++) {
            finalSE[productid] += product_SE[productid][i].SEscore;
        }
        finalSE[productid] = finalSE[productid]/numofsuppliers;
        // Indicates whether the product is officailly published or not.
        published[productid] = true;
        emit Published(productid, productowner[productid], finalSE[productid]);
    }

    //View product owner information
    function viewproductownerinfo(uint8 productid) public view returns(address _owner, uint _finalSE) {
        return(productowner[productid], finalSE[productid]);
    }
    
    //view the information provided by a specific supplier
    function viewsupplierinfo(uint8 productid, uint8 _index) public view returns(address, uint, string memory) {
        return(productsupplychain[productid][_index], product_SE[productid][_index].SEscore, product_SE[productid][_index].ipfsHash);
    }
    
    //check if product is registered
    function productexist(uint8 productid) public view returns(bool) {
        return(productowner[productid]!=address(0));
    }

    //check if the suplychain cycle is complete.
    function cyclecompleted(uint8 productid) public view returns(bool) {
        return cyclecomplete[productid];
    }

    //check if the product is successfully published.
    function checkPublishStatus(uint8 productid) public view returns(bool) {
        return published[productid];
    }

}
