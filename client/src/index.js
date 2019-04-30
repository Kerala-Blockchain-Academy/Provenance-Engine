import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
//Redux and React-Redux components
import {createStore} from 'redux';
import reducer from './store/reducer';
import {Provider} from 'react-redux';

import "assets/css/material-dashboard-react.css?v=1.5.0";

//Routes used for rendering the different components
import indexRoutes from "routes/index.jsx";

const hist = createBrowserHistory();

// Initializing Global Redux store
const store = createStore(reducer);



ReactDOM.render(<Provider store={store}>
<Router history={hist}>
    <Switch>
      {indexRoutes.map((prop, key) => {
        return <Route path={prop.path} component={prop.component} key={key} />;
      })}
    </Switch>
  </Router>
</Provider>,
  document.getElementById("root")
);
