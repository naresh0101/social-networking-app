import React, { Component } from "react";
import axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import { NavLink } from "react-router-dom";
import { Button } from "@material-ui/core";

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wait: false, //this key to show action  is proceding
            proceeding: "Please wait for the seconds!",
            gotologin: false
        };
    }
    handledata = () => {
        const username = document.getElementById("username").value;
        const gen = document.getElementById("gender").value;
        const bio = document.getElementById("bio").value;
        const mail = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        var newuser = {
            username: username,
            gender: gen,
            bio: bio,
            email: mail,
            password: password,
            profile: "../../male.png"
        };
        this.setState({ wait: true });
        if (
            username !== "" &&
            gen !== "" &&
            bio !== "" &&
            mail !== "" && password !== ""
        ) {
            axios
                .post("http://localhost:7000/register", newuser)
                .then(data => {
                    if (data.data.result) {
                        alert("Welcome " + username + " please login");
                    }
                })
                .catch(err => {
                    // console.log(err);
                    alert("User already exist!");
                });
            // -----------------
        } else {
            this.setState({ wait: false });
            alert("Please fill you details proper!");
        }
    };
    render() {
        return (
            <div className="container">
                <Dialog
                    open={this.state.wait}
                    className="justify-content-center"
                >
                    <img width="50%" src="../../loading.gif" alt="#" />
                </Dialog>
                <br />
                <br />
                <div className="row">
                    <div className="col-md-3">
                        {/* this empty comtainer just for responsive */}
                    </div>

                    <form className=" col-md-6 shadow mt-4 pt-4 pb-4">
                        <div className="row">
                            <div className=" col-md-6">
                                <label
                                    htmlFor="firstName"
                                    className="control-label"
                                >
                                    Username
                                </label>
                                <div>
                                    <input
                                        type="text"
                                        id="username"
                                        placeholder="username"
                                        className="form-control"
                                        required
                                        style={{
                                            background: "transparent",
                                            border: "1px solid #330867"
                                        }}
                                    />
                                </div>
                            </div>

                            <div className=" col-md-6">
                                <label
                                    htmlFor="firstName"
                                    className="control-label"
                                >
                                    Gender
                                </label>
                                <div>
                                    <input
                                        type="text"
                                        id="gender"
                                        placeholder="Male | Female | Other"
                                        required
                                        className="form-control"
                                        style={{
                                            textTransform: "uppercase",
                                            background: "transparent",
                                            border: "1px solid #330867"
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="">
                            <label htmlFor="text" className="control-label">
                                Bio{" "}
                            </label>
                            <div>
                                <textarea
                                    className="form-control"
                                    rows="5"
                                    id="bio"
                                    required
                                    placeholder="here will your bio"
                                    maxLength="200"
                                    style={{
                                        background: "transparent",
                                        border: "1px solid #330867"
                                    }}
                                ></textarea>
                            </div>
                        </div>

                        <div className="">
                            <label htmlFor="email" className="control-label">
                                Email*{" "}
                            </label>
                            <div>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Email"
                                    required
                                    className="form-control"
                                    name="email"
                                    style={{
                                        background: "transparent",
                                        border: "1px solid #330867"
                                    }}
                                />
                            </div>
                        </div>
                        <div className="">
                            <label htmlFor="password" className="control-label">
                                Password*
                            </label>
                            <div>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Password"
                                    required
                                    className="form-control"
                                    style={{
                                        background: "transparent",
                                        border: "1px solid #330867"
                                    }}
                                />
                            </div>
                        </div>
                        <button
                            onClick={this.handledata}
                            className="btn btn-primary mt-2"
                            style={{ background: "red", color: "white" }}
                        >
                            Register
                        </button>

                        <Button className="float-right mt-2">
                            <NavLink to="/login" style={{ color: "gray" }}>
                                {" "}
                                Login{" "}
                            </NavLink>
                        </Button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Signup;
