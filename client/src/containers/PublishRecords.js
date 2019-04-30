import React, {Component} from "react";
import {connect} from 'react-redux';
import QRCode from "qrcode.react";

// import Input from "@material-ui/core/Input";
import GridContainer from "../components/Grid/GridContainer";
import TextField from '@material-ui/core/TextField';
import GridItem from "../components/Grid/GridItem";
import Card from "../components/Card/Card.jsx";
import CardBody from "../components/Card/CardBody.jsx";
import CardHeader from "../components/Card/CardHeader.jsx";
import Button from "../components/CustomButtons/Button.jsx";
class PublishRecords extends Component {

    constructor(props) {
        super(props);
        console.log("Props at publish",this.props)
        this.state = {
            accounts: this.props.accounts,
            contract: this.props.contract,
            productId: 0,
            productOwner: "",
            productExist: false,
            cycleComplete: false,
            products: [],
            readyToPublish: false,
            supplierAddresses: [],
            supplierNum: 0,
            supplier: "",
            supplierSE: 0, 
            ipfs: "",
            gotAllInputs: false,
            unsubmittedAddress: null,
            qrtext: ""
        }
    }
    // Publish method.
    // Only the product owner can publish a product.
    onSubmitHandler = async (event) => {
        event.preventDefault();
        alert("Warning: You are about to officially publish the records!");
        const { contract, productId, productOwner } = this.state;
        // Publish method of the contract.
        await contract.methods.publishproductrecords(productId).send({ from: productOwner },(err,result)=>{
            if(err) {
                this.setState({readyToPublish: false});
                console.log("Error at product: ", err);
                alert("Error: Product owner account not recognised, please use the correct wallet address!");
            }
            else {
                this.setState({readyToPublish: false});
                console.log("Result: ",result);
                alert("Records published !");
                this.getQR();
            }
        });
    }


    // Getting basic product details through QR-Code.
    getQR = async () => {
        const { contract, accounts, productId } = this.state;
        // Getting the product owner details and it's final SER value.
        await contract.methods.viewproductownerinfo(productId).call({ from: accounts[0] },(err,result)=>{
            if(err){
                console.log("Error at product: ",err);
            }
            else {
                console.log("Result: ", result);
                this.setState({productOwner: result[0], finalSE: result[1]});
            }
        });
        const qrtxt = "Product ID : " + this.state.productId + " | Product Owner : " + this.state.productOwner;
        // console.log("qrtxt: ", qrtxt);
        this.setState({qrtext: qrtxt});
        // console.log("qrtext: ", this.state.qrtext);
    }

    // Getting the product for publish (verification step).
    checkProduct = async (event) => {
        event.preventDefault();
        const { accounts, contract, productId } = this.state;
        if(accounts==null || contract == null){
            return  alert("Can't find accounts or contracts. Please reload from Home page")
        };
        // check whether the product is exixting or not.
        await contract.methods.productexist(productId).call({ from: accounts[0] },(err,result)=>{
            if(err){
                console.log("Error at product: ",err);
            }
            else {
                console.log("Product Exist: ",result);
                this.setState({productExist: result});
            }
        });
        (this.state.productExist===false) && alert("Product Not Found!");
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
            if(this.state.gotAllInputs===false) {
                this.setState({readyToPublish: false});
                this.setState({unsubmittedAddress: this.state.supplier});
                console.log("unsubmittedAddress ", this.state.unsubmittedAddress);
                alert("Warning: Records of supplier " + this.state.unsubmittedAddress + " has not been submitted yet. Please try again after!");
                break;
            } else {
                this.setState({readyToPublish: false});
            }
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
        // Check wheteher the product is already published or not.
        await contract.methods.checkPublishStatus(productId).call({ from: accounts[0] },(err,result)=>{
            if(err){
                console.log("Error at product: ",err);
            }
            else {
                console.log("Published: ",result);
                this.setState({published: result});
            }
        });
        // Check whether a product owner is registered for a product.
        await contract.methods.viewproductownerinfo(productId).call({ from: accounts[0] },(err,result)=>{
            if(err){
                console.log("Error at product: ",err);
            }
            else {
                console.log("Result: ",result);
                this.setState({productOwner: result[0]});
            }
        });
        // The Publish button only activated when the following conditions satisfied.
        // The user must wait for the procedures to finish.
        if(this.state.productExist===true) {
            if(this.state.gotAllInputs===true) {
                if(this.state.cycleComplete===true) {
                    if(this.state.published===false) {
                        this.state.productOwner ? this.setState({readyToPublish: true}) : this.setState({readyToPublish: false});
                    } else {
                        alert("Warning: Product already published! Any problems?, Please contact Admin.");
                    }
                } else {
                    alert("Error: Cycle not completed!");
                }
            } else {
                alert("Error: Incomplete Data! Please confirm all data from all participants has been submitted.");
            }
        } else {
            alert("Error: Product Not Found!");
        }
    }


    // Changing the states real-time when there is a change in any form elements.
    changeHandler = (event) => {
        this.setState({readyToPublish: false});
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };


    render() {
        return(
            <div>
                <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
                <Card>
                <CardHeader color="primary">
                <h3>Publish Record</h3>
                
                </CardHeader>
                <CardBody>
                <h4>Note: Keep an eye on the Tx Sender address. Only the Product Owner account can submit this form.</h4>
                <form>
                <GridItem xs={12} sm={12} md={4}> 
                    <TextField  
                        name="productId" 
                        label="Product ID"
                        value={this.state.productId}
                        onChange={this.changeHandler}
                        margin="dense"
                        variant="outlined"
                    />
                    </GridItem>
                    <Button color="info" onClick={this.checkProduct}>Product Check</Button>
                    <Button color="success" onClick={this.onSubmitHandler} disabled={!this.state.readyToPublish}>Publish</Button>
                    <br />
                    <GridItem xs={12} sm={12} md={6}> 
                    <div id="status"></div>
                    </GridItem>
                </form>
                <GridContainer align="center">
                <GridItem xs={12} sm={12} md={12}>
                {   
                    ( this.state.qrtext === "" ) ?
                        "" :
                        <div>
                            <QRCode value={this.state.qrtext} />
                            <h6> {this.state.qrtext} </h6>
                        </div>
                }
                </GridItem>
                </GridContainer>
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

export default connect(mapStateToProps,mapDispatchToProps)(PublishRecords);