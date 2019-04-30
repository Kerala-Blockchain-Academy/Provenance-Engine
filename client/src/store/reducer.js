

const initialState ={
    web3: null,
    accounts: [],
    contract: null,
    owner: "",
    

}

const reducer =(state = initialState, action) => {
    if(action.type === "CONTRACT_INIT"){
        return {
            ...state,
            web3: action.payload.web3,
            accounts: action.payload.accounts,
            contract: action.payload.contract,
            owner: action.payload.owner
        }
    }
    
    return state;
}

export default reducer;