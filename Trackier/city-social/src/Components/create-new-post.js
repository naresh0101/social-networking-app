import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DropzoneArea } from "material-ui-dropzone";

import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import Axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import Paper from "@material-ui/core/Paper";

class Makenewpost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opencontent: false,
            mediaopen: false,
            files: [reactLocalStorage.get("tokenkey")],
            uname: "",
            showloading: false
        };
    }

    fileHandler = files => {
        this.setState({ files: files });
    };

    // =================================handle content dilog box
    contenthandleClickOpen = () => {
        this.setState({ opencontent: true });
    };
    contentcancle = () => {
        this.setState({ opencontent: false });
    };
    contentpost = () => {
        this.setState({ opencontent: false });
        // futher code ....handle  post  data
    };

    // ============================= handle media dilog box
    mediahandleClickOpen = () => {
        this.setState({ mediaopen: true });
    };
    mediacancle = () => {
        this.setState({ mediaopen: false });
    };

    mediapost = () => {
        this.setState({ mediaopen: false, showloading: true });
        const formdata = new FormData();
        // push data in the formdata object.
        for (var i = 0; i < this.state.files.length; i++) {
            formdata.append("files", this.state.files[i]);
        }
        formdata.append("token", reactLocalStorage.get("tokenkey"));
        formdata.append(
            "postdescription",
            document.getElementById("postdesc").value
        );

        Axios.post("http://localhost:7000/uploadFile", formdata)
            .then(response => {
                if (response.data.result) {
                    // console.log(response);

                    window.location.reload();
                } else {
                    alert("Somthing went wrong please try again!");
                }
            })
            .catch(err => console.log(err));
        // futher code .... handle  post  data
    };

    componentDidMount() {
        Axios.post("http://localhost:7000/home", {
            token: reactLocalStorage.get("tokenkey")
        })
            .then(data => {
                this.setState({
                    uname: data.data[0]["username"],
                    bio: data.data[0]["bio"],
                    p_pic: data.data[0]["profile"]
                });
                // console.log(data.data[0]);
            })
            .catch(err => {
                console.log(err);
                console.log("------------------------------------");
            });
    }

    render() {
        return (
            <div
                className="container"
                style={{ marginTop: "60px", marginBottom: "50px" }}
            >
                <Paper className="col-md-7">
                    <div
                        className=" p-2 "
                        style={{ display: "flex", flexDirection: "row" }}
                    >
                        <img
                            alt="#"
                            width="45px"
                            height="45px"
                            className="rounded-circle border border-dark"
                            src={this.state.p_pic}
                        ></img>
                        <div className="ml-2">
                            <h5>{this.state.uname}</h5>
                            <span>{this.state.bio}</span>
                        </div>
                    </div>
                    <hr></hr>
                    {/* make post  */}
                    <div className="d-flex justify-content-between mb-2">
                        {/* media dilog box */}
                        <Button
                            color="primary"
                            onClick={this.mediahandleClickOpen}
                        >
                            <AddAPhotoIcon />
                        </Button>

                        <Dialog
                            open={this.state.mediaopen}
                            onClose={this.mediacancle}
                            aria-labelledby="form-dialog-title"
                        >
                            <DialogTitle id="form-dialog-title">
                                Post
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    <div>
                                        <DropzoneArea
                                            onChange={this.fileHandler}
                                        />
                                    </div>
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="postdesc"
                                    label="Any msg for the post..."
                                    // type="email"
                                    fullWidth
                                />
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
                                    Post
                                </Button>
                            </DialogActions>
                        </Dialog>

                        {/* content post dilog box */}
                        <Button
                            color="primary"
                            onClick={this.contenthandleClickOpen}
                        >
                            Write somthing ..
                        </Button>
                        <Dialog
                            open={this.state.opencontent}
                            onClose={this.cancle}
                            aria-labelledby="form-dialog-title"
                        >
                            <DialogTitle id="form-dialog-title">
                                Post
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    You can share somthing helpfull,
                                    positive,etc example Work hard live happy :)
                                    :)
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    // id="name"
                                    label="start writing ....."
                                    // type="email"
                                    fullWidth
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={this.contentcancle}
                                    color="primary"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={this.contentpost}
                                    color="primary"
                                >
                                    Post
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </Paper>
                <Dialog open={this.state.showloading}>
                    <img width="50%" src="../../loading.gif" alt="#" />
                </Dialog>
            </div>
        );
    }
}

export default Makenewpost;
