import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LogIn from "./LogInPage";
import RegIn from "./Registration";
import HPage from "./Homepage";
import Prof from "./Profile";
import Proj from "./Project";
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

function App() {
  
  return ( 
    <BrowserRouter>
    <Switch>
     <Route exact path="/" component={LogIn} />
     <Route path="/Me" component={Prof}/>
     <Route path="/Register" component={RegIn} />
     <Route path="/Home" component={HPage} />
     <Route proj="/MyProjects" component={Proj} />
   </Switch>
   </BrowserRouter>
  )
}


 ReactDOM.render(
   App(),
  document.getElementById("root")
 );