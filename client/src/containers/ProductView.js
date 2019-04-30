import React, {Component} from "react";
import {connect} from 'react-redux';
import './view.css';

//@material-ui custom style components
import TextField from '@material-ui/core/TextField';
import GridContainer from "../components/Grid/GridContainer";
import GridItem from "../components/Grid/GridItem";
import Card from "../components/Card/Card.jsx";
import CardBody from "../components/Card/CardBody.jsx";
import CardHeader from "../components/Card/CardHeader.jsx";
import Button from "../components/CustomButtons/Button.jsx";


class ProductView extends Component {

    constructor(props) {
        super(props);
        console.log("Props at view",this.props)
        this.state = {
            accounts: this.props.accounts,
            contract: this.props.contract,
            productId: 0,
            productExist: false,
            cycleComplete: false,
            index: 0,
            productOwner: "",
            supplierNum: 0,
            supplier: "",
            supplierAddresses: [],
            serValue: 0,
            ipfs: "",
            supplierSE: 0,
            finalSE: 0,
            gotAllInputs: false,
            published: false
         
        }
      
    }

   // Getting the supplier details of specified product.
   getInfo = async () => {
    // Shows the basic product details (includes product owner and final SER).
    const contractAddress = this.state.contract._address;   
    const contractLink = "https://ropsten.etherscan.io/address/"+contractAddress; //only for Ropsten
    document.getElementById("productDetails").innerHTML = "<h3>Contract Link</h3><a href="+contractLink+">"+contractAddress+"</a><br /> <h3>Product Details</h3> <table> <tr> <th>Product ID</th> <th>Product Owner</th> <th>SER</th> </tr> <tr> <td>" + this.state.productId + "</td> <td>" + this.state.productOwner + "</td> <td>" + this.state.finalSE + "</td> </tr> </table>";
    document.getElementById("supplierDetails").innerHTML = "<h3>Supplier Details</h3> <table id='supp_det'> <tr> <th>Supplier Address</th> <th>Supplier SER</th> <th>IPFS Link</th> </tr> </table>";
    const { accounts, contract, productId, supplierNum } = this.state;
    for(let i=0; i<supplierNum; i++) {
        await contract.methods.viewsupplierinfo(productId, i).call({ from: accounts[0] }, (err,result) => {
            if(err){
                console.log("Error at product: ", err);
                alert("Error!");
            }
            else {
                console.log("Result: ", result[0]);
                this.setState({supplier: result[0], supplierSE: result[1], ipfs: result[2]});
            }
        });
        const ipfsLink = "https://ipfs.io/ipfs/" + this.state.ipfs;
        document.getElementById("supp_det").innerHTML += "<tr> <td>" + this.state.supplier + "</td> <td>" + this.state.supplierSE + "</td> <td> <a href=" + ipfsLink + ">" + this.state.ipfs + "</a> </td> </tr>";
    }
};
    //Getting basic product details.
    getProduct = async (event) => {
        event.preventDefault();
        const { accounts, contract, productId } = this.state;
        if(accounts==null || contract == null){
            return  alert("Can't find accounts or contracts. Please reload from Home page")
        };
        // Check whether the product is existing or not.
        await contract.methods.productexist(productId).call({ from: accounts[0] },(err,result)=>{
            if(err){
                console.log("Error at product: ",err);
            }
            else {
                console.log("Product exist: ",result);
                this.setState({productExist: result});
            }
        });
        // Getting the suppliers of the spedified product.
        await contract.methods.getSuppliersOfProduct(productId).call({ from: accounts[0] }, (err,result) => {
            if(err){
                console.log("Error at product: ", err);
            }
            else {
                console.log("Result: ", result[0]);
                this.setState({supplierAddresses: result[0], supplierNum: result[1]});
            }
        });
        // Check whether the whole supplychain participants input their reports.
        for(let i=0; i<this.state.supplierNum; i++) {
            await contract.methods.viewsupplierinfo(productId, i).call({ from: accounts[0] }, (err,result) => {
                if(err){
                    console.log("Error at product: ", err);
                }
                else {
                    console.log("Result: ", result[0]);
                    this.setState({supplier: result[0], supplierSE: result[1], ipfs: result[2]});
                }
            });
            (this.state.supplier && this.state.supplierSE>=0 && this.state.ipfs) ?
                this.setState({gotAllInputs: true}) : this.setState({gotAllInputs: false});  
            console.log("All Inputs? ", this.state.gotAllInputs); 
            if(this.state.gotAllInputs===false) break; 
        }
        // Check whether the supplychain cycle is completed or not.
        // The cycle is completed only after the suppliers inputs the details followed by the product owner.
        // Product owner will be the last player in the chain.
        await contract.methods.cyclecompleted(productId).call({ from: accounts[0] },(err,result)=>{
            if(err){
                console.log("Error at product: ",err);
            }
            else {
                console.log("Cycle completed: ",result);
                this.setState({cycleComplete: result});
            }
        });
        // Check whether the product is officially published.
        await contract.methods.checkPublishStatus(productId).call({ from: accounts[0] },(err,result)=>{
            if(err){
                console.log("Error at product: ",err);
            }
            else {
                console.log("Published: ",result);
                this.setState({published: result});
            }
        });
        // Getting the product owner details and it's final SER value.
        await contract.methods.viewproductownerinfo(productId).call({ from: accounts[0] },(err,result)=>{
            if(err){
                console.log("Error at product: ",err);
            }
            else {
                console.log("Result: ",result);
                this.setState({productOwner: result[0], finalSE: result[1]});
            }
        });
        // Getting the suppliers of the spedified product.
        await contract.methods.getSuppliersOfProduct(productId).call({ from: accounts[0] }, (err,result) => {
            if(err){
                console.log("Error at product: ", err);
            }
            else {
                console.log("Result: ", result[0]);
                this.setState({supplierAddresses: result[0], supplierNum: result[1]});
            }
        });
        if(this.state.productExist===true) {
            if(this.state.gotAllInputs===true) {
                if(this.state.cycleComplete===true) {
                    if(this.state.published===true) {
                        (this.state.productOwner && this.state.supplierAddresses) ? this.getInfo() : alert("Error in data!");
                    } else {
                        alert("Error: Product not published!");
                    }
                } else {
                    alert("Error: Cycle not completed!");
                }
            } else {
                alert("Error: Incomplete Data! Please submit complete data and publish it.");
            }
        } else {
            alert("Error: Product not found!");
        }
    }

    // Changing the states real-time when there is a change in any form elements.
    changeHandler = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    render() {
        return(
            <div>
                <GridContainer>
                <GridItem xs={12} sm={10} md={10}>
                <Card>
                <CardHeader color="warning">
                <h3> View Product </h3>
                </CardHeader>
                <CardBody>
                <form>
                    
                <GridItem xs={12} sm={12} md={5}> 
                <TextField 
                        name="productId" 
                        label="Product ID"
                        value={this.state.productId}
                        onChange={this.changeHandler}
                        placholder="Product ID"
                        margin="dense"
                        variant="outlined" 
                        
                    />
                    </GridItem >
                    <GridItem xs={12} sm={12} md={3}> 
                    <Button color="info" onClick={this.getProduct}>Get Final Product Details</Button>
                    </GridItem>
                   
                    <GridItem xs={12} sm={12} md={6}>
                    <div id="productDetails"></div>
                    </GridItem>
                    <br />
                    
                    <GridItem xs={12} sm={12} md={12}>
                    <div id="supplierDetails">
                    </div>
                
            
                    </GridItem>
                    <br /> <br />
                </form>
                </CardBody>
                </Card>
                </GridItem>
                </GridContainer>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        web3: state.web3,
        accounts: state.accounts,
        contract: state.contract,
        owner: state.owner
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps,mapDispatchToProps)(ProductView);