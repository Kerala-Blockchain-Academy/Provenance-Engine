import React, {Component} from "react";
import {connect} from 'react-redux';
//module to connect with ipfs
import ipfs from "../utils/ipfs";

//@material-ui custom style components
import NativeSelect from '@material-ui/core/NativeSelect';
import GridList from '@material-ui/core/GridList';
import TextField from '@material-ui/core/TextField';
import GridContainer from "../components/Grid/GridContainer";
import GridItem from "../components/Grid/GridItem";
import Card from "../components/Card/Card.jsx";
import CardBody from "../components/Card/CardBody.jsx";
import CardHeader from "../components/Card/CardHeader.jsx";
import Button from "../components/CustomButtons/Button.jsx";

class ProductHandover extends Component {

    constructor(props) {
        super(props);
        console.log("Props at handover",this.props)
        this.state = {
            accounts: this.props.accounts,
            contract: this.props.contract,
            productId: 0,
            productExist: false,
            supplier: "",
            supplierStr: "",
            ipfsHash: "",
            ipfs: "",
            buffer: "",
            supplierAddresses: [],
            supplierNum: 0,
            submitStatus: false,
            showSerForm: false,
            positive: 0,
            neutral: 0,
            negative: 0,
            carb_red_t: 0,
            money_leveraged: 0,
            reported_csr: 0,
            deg_of_sep: 0,
            capital: 0,
            shares: 0,
            margin_errors: 0,
            total_people_impact: 0,
            staff: 0,
            serVal: 0,
            supplierSE: 0, 
            gotAllInputs: false,
            checkStatus: false
        }
    };
    // Post the supplier data.
    onSubmitHandler = async (event) => {
        event.preventDefault();
        alert("Warning: You are about to post your records in public!")
        const { contract, productId, serVal, ipfsHash } = this.state;
        // Getting supplier address.
        const supplier = this.state.supplierStr.split("|");
        const supplierIndex = parseInt(supplier[0]);
        const supplierAddress = supplier[1];
        console.log("From: ", supplierAddress);
        const serValue = parseInt(serVal);
        // Product Handover method of smart contract.
        // Each supplier including product owner hand-overs their details to be published.
        await contract.methods.producthandover(productId, supplierIndex, serValue, ipfsHash).send({ from: supplierAddress },(err,result)=>{
            if(err){
                console.log("Error at product: ",err);
                alert("Error! Please check the selected address from the form and the selected MetaMask address is the same.");
                result && this.setState({checkStatus: false, submitStatus:false});
            }
            else {
                console.log("Result: ", result);
                alert("Product handed over!");
                result && this.setState({checkStatus: false, submitStatus:false});
            }
        });
    };



    // Check if the supplier has already submitted records.
    // If the supplier already submitted, block the supplier from resubmission.
    // If it is mandatory to resubmit, then contact the admin.
    checkSubmit = async (event) => {
        event.preventDefault();
        // Getting the suppliers of the spedified product.
        const { contract, accounts, productId } = this.state;
        await contract.methods.getSuppliersOfProduct(productId).call({ from: accounts[0] }, (err,result) => {
            if(err){
                console.log("Error at product: ", err);
            }
            else {
                console.log("Result: ", result[0]);
                this.setState({supplierAddresses: result[0], supplierNum: result[1]});
            }
        });
        const supplier = this.state.supplierStr.split("|");
        const supplierIndex = parseInt(supplier[0]);
        // Check whether the whole supplychain participants input their reports.
        await contract.methods.viewsupplierinfo(productId, supplierIndex).call({ from: accounts[0] }, (err,result) => {
            if(err){
                console.log("Error at product: ", err);
            }
            else {
                console.log("Result: ", result);
                this.setState({supplier: result[0], supplierSE: result[1], ipfs: result[2]});
            }
        });
        console.log("supplier", this.state.supplier);
        console.log("supplierSE", this.state.supplierSE);
        console.log("ipfs", this.state.ipfs);
        (this.state.supplier && this.state.supplierSE>=0 && this.state.ipfs) ?
            this.setState({gotAllInputs: true}) : this.setState({gotAllInputs: false});  
        console.log("All Inputs? ", this.state.gotAllInputs); 
        if(this.state.gotAllInputs===true) {
            this.setState({submitStatus: false});
            alert("Submit Blocked as Data already submitted! If you need a resubmit, please contact the Admin.");
        } else {
            this.setState({submitStatus: true});
            alert("Warning: You can proceed to POST your records in PUBLIC if you are interested.");
        }
    }


 // IPFS upload method.
    ipfsUpload = async (event) => {
        event.preventDefault();
        // IPFS file upload using the Infura IPFS API.
        // IPFS API file: '../../utils/ipfs'
        await ipfs.add(this.state.buffer, (err, ipfsHash) => {
            if(err) {
                console.log(err);
            }
            // Returns IPFS Hash after storing the file, which we publish to the blockchain later.
            console.log("IPFS Hash: ", ipfsHash);
            try{
            this.setState({ ipfsHash: ipfsHash[0].hash });
        
            // Form must be submitted only after getting the ipfs hash.
            (this.state.ipfsHash === ipfsHash[0].hash) ? 
                this.setState({checkStatus: true}) : this.setState({checkStatus: false});
            }
            catch(err){
            alert("No file uploaded. Please check!")
            console.log("Error at ipfs upload:",err)
        }
        });
    }

      // Captures the file (records file) which is selected for uploading.
    captureFile = (event) => {
        event.stopPropagation();
        event.preventDefault();
        const file = event.target.files[0];
        let reader = new window.FileReader();
        // Reads the file.
        reader.readAsArrayBuffer(file);
        // Converting the file to buffer after capturing it.
        reader.onloadend = () => this.convertToBuffer(reader);
    };

    // Buffering method to stream file binary data.
    convertToBuffer = async (reader) => {
        // File is converted to a buffer for upload to IPFS.
        const buffer = await Buffer.from(reader.result);
        // Set this buffer -using es6 syntax.
        this.setState({buffer});
    };

      // SER Calculation (Provenance Engine - mini version).
    getSER = async (event) => {
        event.preventDefault();
        const original_postive = parseFloat(this.state.positive);
        const original_neutral = parseFloat(this.state.neutral);
        const original_negative = parseFloat(this.state.negative);
        const value_of_tCO2 = 54;
        const carbon_reduction_t = parseFloat(this.state.carb_red_t);
        const total_people_impact = parseFloat(this.state.total_people_impact);
        const staff = parseFloat(this.state.staff);
        const money_leveraged = parseFloat(this.state.money_leveraged); //E50
        const reported_CSR = parseFloat(this.state.reported_csr); //E25 non_statutory_spend
        const deg_of_sep = parseFloat(this.state.deg_of_sep);
        const capitalization = parseFloat(this.state.capital); //E28 net_asset_value
        const shares = parseFloat(this.state.shares); //E27 no_of_service_users
        const margin_errors = parseFloat(this.state.margin_errors);
        const environment_eq = carbon_reduction_t * value_of_tCO2 / 1000000;
        const people_eq  = total_people_impact + (staff/1000000);
        const enviornmental = environment_eq; //E54
        console.log("enviornmental", enviornmental);
        const people = people_eq; //E48
        console.log("people", people);
        let positive = original_postive; //E19
        let total = original_postive + original_neutral + original_negative; //E22
        const critical_sample_size = 0.680625/((margin_errors*margin_errors)/10000);
        const target_population = shares * 1000000;
        if(total < critical_sample_size) {
            const reduced_critical_sentiment_sz = critical_sample_size/(1+(1.65*1.65*0.5*(1-0.5))/((margin_errors/100)*(margin_errors/100)*target_population));
            if(total < reduced_critical_sentiment_sz) {
                    let new_margin_of_errors = Math.sqrt((1.65*1.65)*0.5*(1-0.5)/total);
                        //$new_margin_of_errors = round($new_margin_of_errors*100, 5);
                        new_margin_of_errors = new_margin_of_errors*100;
                        // const reduced_positive_sentiment = (((new_margin_of_errors/100)-(margin_errors/100))*positive);
                        const new_positive_total_sentiment = positive/total*(1-((new_margin_of_errors - margin_errors)/100));
                        positive = new_positive_total_sentiment*total;
                        total = positive+original_neutral+original_negative;
            }
        }
        console.log("positive", positive);
        console.log("total", total);
        const peopleInSer = ((people*capitalization/shares)*positive)/total;
        console.log("People in SER: ", peopleInSer);
        const power = Math.pow(10, deg_of_sep);
        console.log("Money Leveraged + Reported CSR", money_leveraged + reported_CSR);
        const serValue = (enviornmental + money_leveraged + reported_CSR + peopleInSer) / (reported_CSR * power);
        console.log("SER_VALUE: ", serValue);
        // SER sets to a state.
        (serValue >= 0) ? this.setState({serVal: serValue}) : this.setState({serVal: 0});
        // console.log("serVal ", this.state.serVal);
    }


     // Checks if product exists.
     productCheck = async (event) => {
        event.preventDefault();
        const { accounts, contract, productId } = this.state;
        if(accounts==null || contract == null){
            return  alert("Can't find accounts or contracts. Please reload from Home page")
        };

        await contract.methods.productexist(productId).call({ from: accounts[0] },(err,result)=>{
            if(err){
                console.log("Error at product: ",err);
            }
            else {
                // Returns 'true' if the product (or product ID) is existing, or 'false' otherwise.
                console.log("Result: ",result);
                (result===true) ? this.setState({productExist: true}) : this.setState({productExist: false});
            }
        });
        (this.state.productExist===true) ? this.getSuppliers() : alert("Product Not Found!");
    }


    // Gets the suppliers of a product for uploading their individual details / records (including individual SER).
    getSuppliers = async () => {
        const { accounts, contract, productId } = this.state;
        // Fetches suppliers if the product exists. 
        // Contract method for getting the suppliers addresses from blockchain.
        await contract.methods.getSuppliersOfProduct(productId).call({ from: accounts[0] }, (err,result) => {
            if(err) {
                console.log("Error at product: ", err);
            }
            else {
                console.log("Result: ", result[0]);
                this.setState({supplierAddresses: result[0], supplierNum: result[1]});
            }
        });
    }

    // Show the SER form.
    showForm = (event) => {
        event.preventDefault();
        this.setState({showSerForm: true});
    }
    // Close the SER form.
    closeForm = (event) => {
        event.preventDefault();
        this.setState({showSerForm: false});
    }
    // Changing the states real-time when there is a change in any form elements.
    changeHandler = (event) => {
        this.setState({submitStatus: false});
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    loadingHandler = () => {

    }


    
    render() {
        return(
            <div>
                <Card>
                <CardHeader color="success">
                <h3>Product Handover</h3>
                
                </CardHeader>
                 
                 <GridContainer spacing={8}>
                
                 
                <CardBody>
                <h4>Note: Keep an eye on the Tx Sender address. Each Supplier must submit this form.</h4>
                
                <form onSubmit={this.onSubmitHandler}>
                
                <GridItem xs={3} >
                    <TextField  
                        name="productId" 
                        label="Product ID"
                        value= {this.state.productId} 
                        onChange={this.changeHandler} 
                        placeholder="Product ID"
                        margin="dense"
                        variant="outlined"
                    />
                    </GridItem>

                    <Button color="info" onClick={this.productCheck}>Get Supplier list</Button>
                    <br /> 
                    <label>Supplier Address </label>
                    <NativeSelect name="supplierStr" onChange={this.changeHandler}>
                    <option>Supplier Address</option>
                        {(this.state.supplierNum===0) ? 
                            <option>Error: No Suppliers</option> : 
                            (this.state.supplierAddresses).map((supplier, i) => {
                                return <option key={i} value={i.toString()+"|"+supplier}>{supplier}</option>;
                            })
                        }
                    </NativeSelect>
                   
                    <GridItem xs={3} >
                    <TextField  
                        name="serValue" 
                        label="SER Value"
                        value= {this.state.serVal} 
                        onChange={this.changeHandler} 
                        placeholder="SER Value"
                        disabled
                        margin="dense"
                        variant="outlined"
                    />
                    </GridItem>
                   
                    <br />
                    <GridItem xs={12} sm={12} md={10} >
                    <Button color="success" onClick={this.showForm}>Show SER Form</Button>
                    {(this.state.showSerForm===true) ?
                        <div>
                            <h4>SER FORM</h4>
                            <GridList cellHeight={160} cols={3}>
                            <GridItem xs={3} >
                            <TextField 
                                type="number"
                                name="positive" 
                                label="Positive feedback #"
                                value={this.state.positive} 
                                onChange={this.changeHandler}
                                margin="dense"
                                variant="outlined"
                                            
                               
                            />
                            </GridItem>
                            <br />
                            <GridItem  xs={3} >
                            <TextField 
                                type="number"
                                name="neutral" 
                                label="Neutral feedback #"
                                value={this.state.neutral} 
                                onChange={this.changeHandler}                                
                                margin="dense"
                                variant="outlined"
                            />
                            </GridItem>
                            <br />
                            <GridItem xs={3} >
                            <TextField   
                                type="number"
                                name="negative" 
                                label="Negative feedback #"
                                value={this.state.negative} 
                                onChange={this.changeHandler}
                                placeholder="Negative Feedbacks"
                                margin="dense"
                                variant="outlined"
                            />
                            </GridItem>
                            <br />
                            <GridItem xs={3} >
                            <TextField   
                                type="number"
                                name="carb_red_t" 
                                label="Carbon_Reduction_t tCO2e"
                                value={this.state.carb_red_t} 
                                onChange={this.changeHandler}
                                placeholder="Carbon_Reduction_t constant"
                                margin="dense"
                                variant="outlined"
                            />
                            </GridItem>
                            <br />
                            <GridItem xs={3} >
                            <TextField   
                                type="number"
                                name="total_people_impact" 
                                label="Total People Impacted #m"
                                value={this.state.total_people_impact} 
                                onChange={this.changeHandler}
                                placeholder="Total People Impacted"
                                margin="dense"
                                variant="outlined"
                            />
                            </GridItem>
                            <br />
                            <GridItem xs={3} >
                            <TextField   
                                type="number"
                                name="staff" 
                                label="Number of Staffs #"
                                value={this.state.staff} 
                                onChange={this.changeHandler}
                                placeholder="Number of Staffs"
                                margin="dense"
                                variant="outlined"
                            />
                            </GridItem>
                            <br />
                            <GridItem xs={3} >
                            <TextField   
                                type="number"
                                name="money_leveraged" 
                                label="Money Leveraged $m"
                                value={this.state.money_leveraged} 
                                onChange={this.changeHandler}
                                placeholder="Money Leveraged"
                                margin="dense"
                                variant="outlined"
                            />
                            </GridItem>
                            <br />
                            <GridItem xs={3} >
                            <TextField   
                                type="number"
                                name="reported_csr" 
                                label="Reported CSR $m"
                                value={this.state.reported_csr} 
                                onChange={this.changeHandler}
                                placeholder="Reported CSR"
                                margin="dense"
                                variant="outlined"
                            />
                            </GridItem>
                            <br />
                            <GridItem xs={3} >
                            <TextField   
                                type="number"
                                name="deg_of_sep" 
                                label="Degree of Separation #"
                                value={this.state.deg_of_sep} 
                                onChange={this.changeHandler}
                                placeholder="Degree of Separation"
                                margin="dense"
                                variant="outlined"
                            />
                            </GridItem>
                            <br />
                            <GridItem xs={3} >
                            <TextField   
                                type="number"
                                name="capital" 
                                label="Capitalization $m"
                                value={this.state.capital} 
                                onChange={this.changeHandler}
                                placeholder="Capitalization"
                                margin="dense"
                                variant="outlined"
                            />
                            </GridItem>
                            <br />
                            <GridItem xs={3} >
                            <TextField   
                                type="number"
                                name="shares" 
                                label="Shares #m"
                                value={this.state.shares} 
                                onChange={this.changeHandler}
                                placeholder="Shares"
                                margin="dense"
                                variant="outlined"
                            />
                            </GridItem>
                            <br />
                            <GridItem xs={3} >
                            <TextField   
                                type="number"
                                name="margin_errors" 
                                label="Margin of Errors %"
                                value={this.state.margin_errors} 
                                onChange={this.changeHandler}
                                placeholder="Margin of Errors"
                                margin="dense"
                                variant="outlined"
                            />
                            </GridItem>
                            </GridList>
                            
                            <br /> <br />
                            <Button color="info" onClick={this.getSER}>Get SER</Button>
                            <Button color="danger" onClick={this.closeForm}>Close</Button>
                            
                        </div> : null
                    }
                    <br />
                    </GridItem>
                    
                    <GridItem xs={3} >
                    <label>Upload Financial Year Report</label>
                    <TextField   
                    type="file" 
                    onChange={this.captureFile} 
                    margin="dense"
                    variant="outlined"
                      />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6} >
                    <Button align="center" color="primary" onClick={this.ipfsUpload}>Upload</Button>
                    <div id="loading">
                    {/* <CircularProgress /> */}
                    </div>
                    </GridItem>
                    <GridContainer>
                    <GridItem xs={12} sm={12} md={6} >
                    
                    </GridItem>
                    </GridContainer>
                    <br /><br />
                    <GridItem xs={12} sm={12} md={6} >
                    <Button color="info" disabled={!(this.state.checkStatus)} onClick={this.checkSubmit}>Check Data Duplication</Button>
                    <Button  color="primary"type="submit" disabled={!(this.state.submitStatus)}>Submit</Button>
                    </GridItem>
                    
                </form>
                
                </CardBody>
                
                
                </GridContainer>
                </Card>
            </div>
        );
    };

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

export default connect(mapStateToProps,mapDispatchToProps)(ProductHandover);