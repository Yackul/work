import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LogIn from "./LogInPage";
import RegIn from "./Registration";
import HPage from "./Homepage";
import Prof from "./Profile";
import RA from "./RecoverAccount";
import Rev from "./ReviewCreator";
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import InComment from './Project';
import './index2.css';
Amplify.configure(awsconfig);

function App() {

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LogIn} />
        <Route path="/Me" component={Prof} />
        <Route path="/Register" component={RegIn} />
        <Route path="/Home" component={HPage} />
        <Route path="/Projects" component={InComment} />
        <Route path="/RecoverAccount" component={RA} />
        <Route path="/Review" component={Rev} />
      </Switch>
    </BrowserRouter>
  )
}


ReactDOM.render(
  App(),
  document.getElementById("root")
);
