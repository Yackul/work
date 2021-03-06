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
import FH from './File_History';
import AU from './AboutUs'

import './index2.css';
Amplify.configure(awsconfig);

function App() {

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/LogIn" component={LogIn} />
        <Route exact path="/Me" component={Prof} />
        <Route exact path="/Register" component={RegIn} />
        <Route exact path="/" component={HPage} />
        <Route exact path="/Projects" component={ProjTest} />
        <Route exact path="/RecoverAccount" component={RA} />
        <Route exact path="/Review" component={Rev} />
        <Route exact path='/Projects/:id' component={PDP}/>
        <Route exact path='/Projects/:id/:id2?' component={RevDis}/>
        <Route exact path={"/Projects/:id/:id2/History_:id3?"} component={FH}/>
        <Route exact path="/CommentTest" component={InComment} />
        <Route exact path="/AboutUs" component={AU} />
        <Route exact path='/Err404' component={Err}/>
        <Redirect from='/Me/*' to='/Err404'/>
        <Redirect from='/Register/*' to='/Err404'/>
        <Redirect from='/LogIn/*' to='/Err404'/>
        <Redirect from='/Projects/*' to='/Err404'/>
        <Redirect from='/ProjectsTest/*' to='/Err404'/>
        <Redirect from='/AboutUs/*' to='/Err404'/>
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
