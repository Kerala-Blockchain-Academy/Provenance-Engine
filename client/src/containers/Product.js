import React, {Component} from "react";
import {connect} from 'react-redux';

//material ui style components
import GridContainer from "../components/Grid/GridContainer";
import AddAlert from "@material-ui/icons/AddAlert";
import GridItem from "../components/Grid/GridItem";
import Card from "../components/Card/Card.jsx";
import CardBody from "../components/Card/CardBody.jsx";
import CardHeader from "../components/Card/CardHeader.jsx";
import Button from "../components/CustomButtons/Button.jsx";
import Snackbar from "../components/Snackbar/Snackbar.jsx";
import TextField from '@material-ui/core/TextField';


class Product extends Component {

    constructor(props) {
        super(props);
        console.log("Props at product",this.props)
        this.state = {
            accounts: this.props.accounts,
            contract: this.props.contract,
            owner: this.props.owner,
            productId: 0,
            supplierAddresses: [],
            productOwner: "",
            statusOk:false,
            statusFail:false
        }
    }
    
    // onSubmit function
    onSubmitHandler = async () => {
        const { accounts, contract, productId, productOwner } = this.state;
        
        
        try {
            let supplierAddresses = this.state.supplierAddresses;
            // As the addresses of the participant suppliers passed from the form as a string, 
            // we have to convert it into an array, in order to pass them to the contract method.
            supplierAddresses = supplierAddresses.split(",");
            // Calling contract method product() for adding the product.
            await contract.methods.product(productId, supplierAddresses, productOwner).send({ from: accounts[0] },(err,result)=>{
                if(err){
                    console.log("Error at product: ", err);
                    alert("Error: Admin account not recognised, please use the correct wallet address!");
                } else {
                    // Tx Hash.
                    console.log("Result: ", result);
                    alert("Product Registered!");
                }
            });
        } catch(error) {
            console.log(error);
            alert("Error: Look out!  Hint: Complete the form and select the correct Admin address")
        }
    }
    
     // Checking whether the product is existing or not.
    checkProduct = async (event) => {
        event.preventDefault();
        var Result;
        const { accounts, contract, productId } = this.state;
        if(accounts==null || contract == null){return  alert("Can't find accounts or contracts. Please reload from Home page")};
        
            
           
        // Calling the productexist() function from the contract.
        await contract.methods.productexist(productId).call({ from: accounts[0] },(err,result)=>{
            if(err){
                console.log("Error at product: ",err);
            }
            else {
                // Returns 'true' if the product (or product ID) is existing, or 'false' otherwise.
                console.log("Product already exist? ",result);
                Result = result;
            }
        });
        // Shows the result (product is existing or not) in the page.
        Result ? this.showNotification("statusOk") : this.onSubmitHandler();
    }

    showNotification(place) {
        var x = [];
        x[place] = true;
        this.setState(x);
        this.alertTimeout = setTimeout(
          function() {
            x[place] = false;
            this.setState(x);
          }.bind(this),
          2000
        );
      }
    
    // Changing the states real-time when there is a change in any form elements.
     changeHandler = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
        
        
        
    };
    
    render() {
        return (
            
            <div>
                <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
                <Card>
                <CardHeader color="warning">
                <h3>Add Product</h3>
                
                </CardHeader>
                <CardBody>
                <h4>Note: Keep an eye on the Tx Sender address. Only the Owner (Deployer / Admin) account can submit this form.</h4>
                <form onSubmit={this.checkProduct}>
                <GridItem xs={12} sm={12} md={3}> 
                <TextField 
                    name="productId" 
                    label="Product ID"
                    value= {this.state.productId} 
                    onChange={this.changeHandler} 
                    margin="dense"
                    variant="outlined"
                 />
                
                </GridItem >
                <br />
                <GridItem xs={12} sm={12} md={3}> 
                <TextField 
                    name="supplierAddresses" 
                    label="Supplier Addresses"
                    value={this.state.supplierAddresses} 
                    onChange={this.changeHandler} 
                    margin="dense"
                    variant="outlined"
                />
                </GridItem>
                <br />
                <GridItem xs={12} sm={12} md={3}>
                <TextField 
                
                    name="productOwner" 
                    label="Product Owner"
                    value={this.state.productOwner} 
                    onChange={this.changeHandler} 
                    margin="dense"
                    variant="outlined"
                    
                      />
                      </GridItem>
                <br />
                <Button color="primary" type="submit">Submit</Button>
                </form>
                
                <div>
                               
                    <Snackbar
                         place="tc"
                         color="info"
                         icon={AddAlert}
                         message="Product already registered!"
                         open={this.state.statusOk}
                         closeNotification={() => this.setState({ statusOk: false })}
                         close
                         /> 
                         <Snackbar
                         place="tc"
                         color="info"
                         icon={AddAlert}
                         message="Product Not Found !"
                         open={this.state.statusFail}
                         closeNotification={() => this.setState({ statusFail: false })}
                         close
                         /> 
                         
                    <br /><br />
                    <div id="productExist"></div>
                </div>
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
        newTransaction: (txhash) => dispatch({type:"NEW_TXN",value:txhash})
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(Product);