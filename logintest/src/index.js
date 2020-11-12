import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import LogIn from "./LogInPage";
import RegIn from "./Registration";
 const rootElement = document.getElementById("root");
 ReactDOM.render(
   <BrowserRouter>
    <Switch>
     <Route exact path="/" component={LogIn} />
     <Route path="/Register" component={RegIn} />
   </Switch>
   </BrowserRouter>,
   rootElement
 );