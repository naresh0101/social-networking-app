import React, { Component, Fragment } from "react";
import Allpost from "./all-post";
import PrimarySearchAppBar from "./Appbar";
import Makenewpost from "./create-new-post";
import { Redirect } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: false
        };
    }

    componentWillMount() {
        var token = reactLocalStorage.get("tokenkey");
        if (token === undefined) {
            this.setState({
                login: true
            });
        }
    }

    render() {
        if (this.state.login) {
            return <Redirect to="/" />;
        }
        return (
            <Fragment>
                {/* <PrimarySearchAppBar/>  */}
                <PrimarySearchAppBar />
                <Makenewpost />
                <Allpost />
            </Fragment>
        );
    }
}

export default Home;
