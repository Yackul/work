import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import LogIn from "./LogInPage";
import RegIn from "./Registration";
import HPage from "./Homepage";
import Prof from "./Profile";
import RA from "./RecoverAccount";
import Rev from "./ReviewCreator";
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import InComment from './Project';
import ProjTest from './Project2';
import PDP from './ProjectsDisplayPage';
import RevDis from './RevDis';
import Err from './404';

import './index2.css';
Amplify.configure(awsconfig);

function App() {

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LogIn} />
        <Route exact path="/Me" component={Prof} />
        <Route exact path="/Register" component={RegIn} />
        <Route exact path="/Home" component={HPage} />
        <Route exact path="/Projects" component={ProjTest} />
        <Route exact path="/RecoverAccount" component={RA} />
        <Route exact path="/Review" component={Rev} />
        <Route exact path='/Projects/:id' component={PDP}/>
        <Route path='/Projects/:id/:id2?' component={RevDis}/>
        <Route exact path="/CommentTest" component={InComment} />
        <Route exact path='/Err404' component={Err}/>
        <Redirect from='/Me/*' to='/Err404'/>
        <Redirect from='/Register/*' to='/Err404'/>
        <Redirect from='/Home/*' to='/Err404'/>
        <Redirect from='/Projects/*' to='/Err404'/>
        <Redirect from='/ProjectsTest/*' to='/Err404'/>
        <Redirect from='/RecoverAccount/*' to='/Err404'/>
        <Redirect from='/Review/*' to='/Err404'/>
        <Redirect from='/Projects/:id*' to='/Err404'/>
        <Redirect from='/Projects/:id/id2?*' to='/Err404'/>
        <Redirect from='/Projects/:id/*' to='/Err404'/>
        <Redirect from='/CommentTest/*' to='/Err404'/>
        <Redirect from='/*' to='/Err404'/>
      </Switch>
    </BrowserRouter>
  )
}


ReactDOM.render(
  App(),
  document.getElementById("root")
);
