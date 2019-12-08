import React, { Component, Fragment } from "react";
import { Button } from "@material-ui/core";
import CameraAltIcon from "@material-ui/icons/CameraAlt";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DropzoneArea } from "material-ui-dropzone";
import PrimarySearchAppBar from "./Appbar";
import Axios from "axios";
import { Redirect } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "VickyBacha",
            bio: "Life is too sort don\t wast it copy my Bio :cool",
            profilepic: ""
        };
    }

    // chage profile pic
    changeprofile = () => {
        this.setState({ mediaopen: true });
    };
    mediacancle = () => {
        this.setState({ mediaopen: false });
    };
    mediapost = () => {
        this.setState({ mediaopen: false });

        // futher code .... handle  post  data
    };

    // detail change  box
    openform = () => {
        this.setState({ openchangeform: true });
    };

    canclechanges = () => {
        this.setState({ openchangeform: false });
    };
    updatechanges = () => {
        this.setState({ openchangeform: false });
        // playt with backend ....
    };

    componentDidMount() {
        var token = reactLocalStorage.get("tokenkey");
        if (token === undefined) {
            this.setState({
                login: true
            });
        }

        Axios.post("http://localhost:7000/profile", {
            token: reactLocalStorage.get("tokenkey")
        })
            .then(data => {
                this.setState({
                    username: data.data[0]["username"],
                    bio: data.data[0]["bio"],
                    p_pic: data.data[0]["profile"],
                    email: data.data[0]["email"]
                });
            })
            .catch(err => {
                console.log(err);
                console.log("------------------------------------");
            });
    }

    render() {
        if (this.state.login) {
            return <Redirect to="/" />;
        }
        return (
            <Fragment>
                <PrimarySearchAppBar />
                <div className="container">
                    <div className="row mt-4">
                        <div className="col-md-8 shadow">
                            <center className="p-4">
                                <img
                                    alt="#"
                                    src={this.state.p_pic}
                                    width="50%"
                                    height="50%"
                                    className="rounded-circle profile-circle"
                                />
                                <Button
                                    onClick={this.changeprofile}
                                    className="edit-p-pic"
                                >
                                    <h6 style={{ color: "red" }}>
                                        <CameraAltIcon
                                            style={{ fontSize: "45px" }}
                                        />
                                    </h6>
                                </Button>

                                <Dialog
                                    open={this.state.mediaopen}
                                    onClose={this.mediacancle}
                                    aria-labelledby="form-dialog-title"
                                >
                                    <DialogTitle id="form-dialog-title">
                                        click over this box
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            <DropzoneArea
                                                onChange={this.handleChange}
                                            />
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button
                                            onClick={this.mediacancle}
                                            color="primary"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={this.mediapost}
                                            color="primary"
                                        >
                                            change
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </center>

                            <center>
                                <h4 className="mt-4">
                                    <em>{this.state.username}</em>
                                </h4>
                                <email>naresh@navgurkul.org , </email>

                                <h5 style={{ color: "gray" }}>
                                    {this.state.bio}
                                </h5>
                            </center>
                            <Button
                                className="float-right mb-2"
                                onClick={this.openform}
                            >
                                Edit details
                            </Button>

                            <Dialog
                                open={this.state.openchangeform}
                                onClose={this.mediacancle}
                                aria-labelledby="form-dialog-title"
                            >
                                <DialogTitle id="form-dialog-title">
                                    Click into box to make chage
                                </DialogTitle>
                                <DialogContent>
                                    <form
                                        className="form-horizontal col-md-12"
                                        role="form"
                                    >
                                        <div className=" form-group">
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
                                                    placeholder={
                                                        this.state.username
                                                    }
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label
                                                htmlFor="text"
                                                className="control-label"
                                            >
                                                Bio{" "}
                                            </label>
                                            <div>
                                                <textarea
                                                    className="form-control"
                                                    rows="5"
                                                    id="comment"
                                                    placeholder={this.state.bio}
                                                    maxLength="200"
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label
                                                htmlFor="email"
                                                className="control-label"
                                            >
                                                Email*{" "}
                                            </label>
                                            <div>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    placeholder={
                                                        this.state.email
                                                    }
                                                    className="form-control"
                                                    name="email"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label
                                                htmlFor="password"
                                                className="control-label"
                                            >
                                                Old Password*
                                            </label>
                                            <div>
                                                <input
                                                    type="password"
                                                    id="old-password"
                                                    placeholder="********"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label
                                                htmlFor="password"
                                                className="control-label"
                                            >
                                                New Password*
                                            </label>
                                            <div>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    placeholder="Type your new password"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        onClick={this.canclechanges}
                                        color="primary"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={this.updatechanges}
                                        color="primary"
                                    >
                                        change
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Profile;
