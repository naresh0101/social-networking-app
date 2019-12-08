import React, { Component } from "react";
import axios from "axios";
import { NavLink, Redirect } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";

class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            home: false
        };
    }

    componentDidMount() {
        var token = reactLocalStorage.get("tokenkey");
        if (token !== undefined) {
            this.setState({
                home: true
            });
        }
    }

    login = e => {
        e.preventDefault();
        // console.log("pass");
        var Email = document.getElementById("email").value;
        var Password = document.getElementById("password").value;

        axios
            .post("http://localhost:7000/login", {
                email: Email,
                password: Password
            })
            .then(data => {
                console.log(data.data.result);

                if (data.data.result) {
                    reactLocalStorage.set("tokenkey", data.data.Token);
                    this.setState({
                        home: true
                    });
                } else {
                    alert("user not valid");
                }
            })
            .catch(err => {
                console.log("login error ----------------------------------");

                console.error(err);
            });
    };

    render() {
        // console.log(this.state.home);
        if (this.state.home) {
            return <Redirect to="/home" />;
        }
        if (reactLocalStorage.get("tokenkey" === undefined)) {
            return <Redirect to="/login" />;
        }
        return (
            <div className="container login-container">
                <div className="row">
                    <div className="col-md-3 login-form-1"></div>
                    <br />
                    <br />

                    <div className="col-md-6 login-form-2">
                        {/* <h3>Login for Form 2</h3> */}
                        <form onSubmit={this.login}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="email"
                                    className="form-control"
                                    placeholder="Your Email *"
                                    style={{
                                        background: "transparent",
                                        border: "1px solid #330867"
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    id="password"
                                    className="form-control"
                                    placeholder="Your Password *"
                                    style={{
                                        background: "transparent",
                                        border: "1px solid #330867"
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <button
                                    // onClick={() => this.login()}
                                    className="btn btn-primary mt-2"
                                    style={{
                                        background: "red",
                                        color: "white"
                                    }}
                                >
                                    Login
                                </button>
                            </div>

                            <div className="form-group d-flex justify-content-between">
                                <NavLink
                                    to="/register"
                                    style={{ color: "gray" }}
                                >
                                    {" "}
                                    Create account{" "}
                                </NavLink>

                                <NavLink
                                    to="/register"
                                    style={{ color: "gray" }}
                                >
                                    {" "}
                                    forgot pass{" "}
                                </NavLink>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Signin;
