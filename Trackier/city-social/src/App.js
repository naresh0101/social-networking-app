import React from "react";
// import logo from './logo.svg';
import "./App.css";
import Signin from "./Components/signin";
import Signup from "./Components/signup";
import Profile from "./Components/profile";
import Home from "./Components/home";

import { Route, BrowserRouter as Router } from "react-router-dom";

function App() {
    return (
        <div className="App">
            <Router>
                <Route path="/home" exact component={Home} />
                <Route path="/" exact component={Signin} />
                <Route path="/login" exact component={Signin} />
                <Route path="/register" exact component={Signup} />
                {/* <Route path="/forgotpassword" exact component={Forgetpass} /> */}
                <Route path="/profile" exact component={Profile} />
            </Router>
        </div>
    );
}

export default App;
