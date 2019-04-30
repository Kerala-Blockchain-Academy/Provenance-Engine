import React, { Component } from "react";
//main contract
import SupplychainContract from "./contracts/Supplychain.json";

//web3 initialization modules
import getWeb3 from "./utils/getWeb3";
//material-ui modules 
import GridContainer from "./components/Grid/GridContainer";
import GridItem from "./components/Grid/GridItem";
import Card from "./components/Card/Card.jsx";
import CardBody from "./components/Card/CardBody.jsx";
import CardHeader from "./components/Card/CardHeader.jsx";
//Redux modules
import {connect} from 'react-redux';



class App extends Component {

  constructor(props) {
    super(props);
    console.log(this.props.transactions)
  }

  componentDidMount = async () => {
    console.log("componentDidMount")
      try {
          // Get network provider and web3 instance.
          const web3 = await getWeb3();
          // Use web3 to get the user's accounts.
          const accounts = await web3.eth.getAccounts();
          console.log("Accounts: ", accounts);
          
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = SupplychainContract.networks[networkId];
          // Get the contract instance.
          const instance = new web3.eth.Contract(SupplychainContract.abi, deployedNetwork && deployedNetwork.address);
          // Set web3, accounts, and contract to the payload, and then proceed with the initialization 
          // of the Redux state using CONTRACT_INIT action

          const payload ={
            web3, accounts, contract: instance, owner: accounts[0] 
          }
          // console.log("Payload: ",payload)

           this.props.onInitialization(payload)

      } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
              `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
      }
  };
  

  render() {

    
    
    if(!this.props.web3) {
      return <div>
        <h2>
        If you are seeing this message you have not properly loaded the dependencies or have made a mistake in executing them in order.
        Please try the options below to make this DAPP work smoothly :</h2>
       <h3> <ul> 
       <li>Check whether the Web3 Provider is properly loaded.</li> 
       <li> If you are using Ganache client please make sure that you have connected all the accounts using seed phrases.</li>
       <li>Check whether you have properly run truffle migrate --reset.</li>
       Note: This error could also occur if you refreshed this dapp from one of the other routed pages. To solve this 
       refresh the dapp from the Home page.
        </ul></h3> </div>;
    }
    return(
      <div>
        <Card>
          <CardHeader color="success" align="center" >
            <h1>Provenance Engine</h1>
            
          </CardHeader>
          <CardBody>
          <GridContainer align="center">
            <GridItem >
              
            <p><h4>In the world of transparency and good things, people have their own right to track things from the start to the 
              finish. Moreover, in the rise of social responsibility and an increasing interest in the ethical practices, 
              no one would like to purchase products from unhappy workers, the soft assets
               like the positive sentiment should not be un-regarded in the decision making progress.</h4> </p>
               
               </GridItem>
               </GridContainer>
               <GridContainer align="center">
               <GridItem xs={12} >
          <p><h4> Welcome to Provenance Engine. The Dapp that uses the revolutionary Distributed Ledger Technology and 
            CCEG's Social Earnings Ratio to bring about total transparency and traceability.</h4></p>
            </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </div>
    );
  }
  
}


//mapping the global redux state as props for this component
const mapStateToProps = state => {
  return {
    web3: state.web3,
    accounts: state.accounts,
    contract: state.contract,
    owner: state.owner,
    transactions: state.transactions
  };
};

//To dispatch actions for changing the global state  in the Reducer
const mapDispatchToProps = dispatch => {
  return {
      onInitialization: (payload) => dispatch({type: "CONTRACT_INIT",payload:payload})
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(App);


