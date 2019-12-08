import React, { Component, Fragment } from "react";

import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import FavoriteIcon from "@material-ui/icons/Favorite";
import CommentIcon from "@material-ui/icons/Comment";

import Axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import { Button, TextField } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";

class Allpost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opencontent: false,
            mediaopen: false,
            files: [],
            hostedmedia:
                "https://social-media-naresh.s3.us-east-2.amazonaws.com/",

            like: { color: "gray", cursor: "pointer", totallike: 0 },
            comments: { color: "gray", cursor: "pointer", totalcomment: 0 },
            allpost: [],
            showpost: { display: "none" },
            likeaction: { color: "gray" },
            handlelikeStatus: [],
            opentwit: false,
            showcomments: []
        };
    }

    comment = postId => {
        var comment = document.getElementById("comment" + postId).value;
        var comments = Number(
            document.getElementById("ttwit" + postId).innerText
        );
        document.getElementById("comment" + postId).value = null;
        if (comment !== "") {
            comments += 1;
            document.getElementById("ttwit" + postId).innerText = comments;
            Axios.post("http://localhost:7000/savecomment", {
                token: reactLocalStorage.get("tokenkey"),
                postId: Number(postId) + 1,
                comment: comment,
                totalcomment: comments
            })
                .then(data => {
                    // console.log(data);
                })
                .catch(err => {
                    alert("Opps! somthing went wrong :(");
                });
        }
    };

    //   ==========================  action on post
    likepost(postid) {
        var total_like = Number(document.getElementById(postid).innerText);
        var like;
        if (document.getElementById("like" + postid).style.color !== "red") {
            document.getElementById("like" + postid).style.color = "red";
            total_like += 1;
            document.getElementById(postid).innerText = total_like;
            like = true;
        } else {
            document.getElementById("like" + postid).style.color = "black";
            total_like -= 1;
            like = false;
            document.getElementById(postid).innerText = total_like;
        }

        Axios.post("http://localhost:7000/handlelike", {
            token: reactLocalStorage.get("tokenkey"),
            postId: Number(postid),
            like: total_like,
            likestatus: like
        })
            .then(data => {
                // console.log(data);
            })
            .catch(err => {
                alert("Opps! somthing went wrong :(");
            });
    }

    componentWillMount() {
        Axios.get("http://localhost:7000/showallpost")
            .then(data => {
                if (data.data.data !== undefined) {
                    this.setState({
                        allpost: data.data.data,
                        showpost: { display: "block" }
                    });
                }
            })
            .catch(err => {
                alert("Opps! somthing went wrong :(");
            });
        // this reqest to see the liked post by me
        Axios.post("http://localhost:7000/activityonpost", {
            token: reactLocalStorage.get("tokenkey")
        })
            .then(data => {
                this.setState({ handlelikeStatus: data.data });
            })
            .catch(err => {
                alert("Opps! somthing went wrong :(");
            });
    }

    showcomment(postId) {
        if (
            document.getElementById("showcomment" + postId).style.display ===
            "block"
        ) {
            document.getElementById("showcomment" + postId).style.display =
                "none";
        } else {
            Axios.post("http://localhost:7000/showcomment-on-post", {
                postId: postId
            })
                .then(data => {
                    if (data.data.data.length !== 0) {
                        this.setState({ showcomments: data.data.data });
                        document.getElementById(
                            "showcomment" + postId
                        ).style.display = "block";
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    render() {
        // console.log(this.state.allpost);

        for (var i in this.state.handlelikeStatus) {
            var likepost = this.state.handlelikeStatus[i].postId;
            document.getElementById("like" + likepost).style.color = "red";
        }

        return (
            <div className="container mt-4">
                <div className="mt-4" style={this.state.showpost}>
                    {this.state.allpost.map((post, index) => {
                        if (post.contentType === "video/mp4") {
                            return (
                                <Paper key={index} className="col-md-7 mb-4">
                                    {/* <div className='Small shadow p-2 mb-4'> */}
                                    <div
                                        className=" p-2 "
                                        style={{
                                            display: "flex",
                                            flexDirection: "row"
                                        }}
                                    >
                                        <img 
                                            alt="#"
                                            width="45px"
                                            height="45px"
                                            className="rounded-circle userpics"
                                            src={post.postedbypic}
                                        ></img>
                                        <div className="ml-4">
                                            <h6>{post.username}</h6>
                                            <time style={{ color: "gray" }}>
                                                {post.datetime}{" "}
                                            </time>
                                        </div>
                                    </div>
                                    <p>{post.description}</p>

                                    <video width="100%" height="auto" controls>
                                        <source
                                            src={
                                                this.state.hostedmedia +
                                                post.post
                                            }
                                            type="video/mp4"
                                        ></source>
                                    </video>

                                    <div className="d-flex align-items-center justify-content-between border-top border-bottom mt-2">
                                        <div className="d-flex align-items-center">
                                            <div
                                                className="p-2"
                                                id={"like" + post.id}
                                            >
                                                <FavoriteIcon
                                                    onClick={() =>
                                                        this.likepost(post.id)
                                                    }
                                                />
                                            </div>
                                            <span
                                                id={index}
                                                className="float-right"
                                            >
                                                {post.like}
                                            </span>
                                        </div>
                                        <Button
                                            title="click to see all comments on this post"
                                            onClick={() =>
                                                this.showcomment(post.id)
                                            }
                                        >
                                            <span id={"ttwit" + index}>
                                                {post.comments}{" "}
                                            </span>{" "}
                                            <CommentIcon />
                                        </Button>
                                    </div>

                                    <div className="d-flex flex-column mb-2">
                                        <TextField
                                            required
                                            margin="dense"
                                            id={"comment" + index}
                                            label="Add comment ....."
                                            fullWidth
                                        />
                                        <Button
                                            onClick={() => this.comment(index)}
                                            className="float-right bg-primary text-white mb-2"
                                        >
                                            Comment{" "}
                                        </Button>
                                    </div>
                                    {/* </div> */}

                                    <div
                                        className=" p-2"
                                        style={{ display: "none" }}
                                        id={"showcomment" + post.id}
                                    >
                                        {this.state.showcomments.map(
                                            (comments, index) => {
                                                return (
                                                    <Fragment>
                                                        <div
                                                            key={index}
                                                            className="d-flex justify-content-start"
                                                        >
                                                            <AccountCircleIcon
                                                                width="55px"
                                                                height="55px"
                                                                color="gray"
                                                            />
                                                            <div className="d-flex flex-column">
                                                                <div className="ml-2 d-flex justify-content-start">
                                                                    <h6>
                                                                        {
                                                                            comments.user_mail
                                                                        }
                                                                    </h6>
                                                                    <span
                                                                        className="text-black-50 float-right ml-2"
                                                                        style={{
                                                                            fontSize:
                                                                                "10px"
                                                                        }}
                                                                    >
                                                                        {
                                                                            comments.time
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <span className="ml-2">
                                                                    {
                                                                        comments.comment
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                    </Fragment>
                                                );
                                            }
                                        )}
                                        <hr />
                                    </div>
                                </Paper>
                            );
                        }
                        if (post.contentType !== "video/mp4") {
                            return (
                                <Fragment>
                                    <Paper
                                        key={index}
                                        className="col-md-7 mt-2 mb-4"
                                    >
                                        <div
                                            className=" p-2 "
                                            style={{
                                                display: "flex",
                                                flexDirection: "row"
                                            }}
                                        >
                                            <img
                                                alt="#"
                                                width="45px"
                                                height="45px"
                                                className="rounded-circle userpics"
                                                src={post.postedbypic}
                                            ></img>
                                            <div className="ml-4">
                                                <h6>{post.username}</h6>
                                                <time style={{ color: "gray" }}>
                                                    {post.datetime}{" "}
                                                </time>
                                            </div>
                                        </div>
                                        <p>{post.description}</p>

                                        <img
                                            alt="#"
                                            src={
                                                this.state.hostedmedia +
                                                post.post
                                            }
                                            width="100%"
                                        />
                                        <div className="d-flex align-items-center justify-content-between border-top border-bottom mt-2">
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className="p-2"
                                                    id={"like" + post.id}
                                                >
                                                    <FavoriteIcon
                                                        onClick={() =>
                                                            this.likepost(
                                                                post.id
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <span
                                                    id={post.id}
                                                    className="float-right"
                                                >
                                                    {post.like}
                                                </span>
                                            </div>
                                            <Button
                                                title="click to see all comments on this post"
                                                onClick={() =>
                                                    this.showcomment(post.id)
                                                }
                                            >
                                                <span id={"ttwit" + index}>
                                                    {post.comments}{" "}
                                                </span>{" "}
                                                <CommentIcon />
                                            </Button>
                                        </div>

                                        <div className="d-flex flex-column ">
                                            <TextField
                                                required
                                                margin="dense"
                                                id={"comment" + index}
                                                label="Add comment ....."
                                                fullWidth
                                            />
                                            <Button
                                                onClick={() =>
                                                    this.comment(index)
                                                }
                                                className="float-right bg-primary text-white mb-2"
                                            >
                                                Comment{" "}
                                            </Button>
                                        </div>

                                        <div
                                            className=" p-2"
                                            style={{ display: "none" }}
                                            id={"showcomment" + post.id}
                                        >
                                            {this.state.showcomments.map(
                                                (comments, index) => {
                                                    return (
                                                        <Fragment>
                                                            <div
                                                                key={index}
                                                                className="d-flex justify-content-start"
                                                            >
                                                                <AccountCircleIcon
                                                                    width="55px"
                                                                    height="55px"
                                                                    color="gray"
                                                                />
                                                                <div className="d-flex flex-column">
                                                                    <div className="ml-2 d-flex justify-content-start">
                                                                        <h6>
                                                                            {
                                                                                comments.user_mail
                                                                            }
                                                                        </h6>
                                                                        <span
                                                                            className="text-black-50 float-right ml-2"
                                                                            style={{
                                                                                fontSize:
                                                                                    "10px"
                                                                            }}
                                                                        >
                                                                            {
                                                                                comments.time
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <span className="ml-2">
                                                                        {
                                                                            comments.comment
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <hr />
                                                        </Fragment>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </Paper>
                                </Fragment>
                            );
                        }
                    })}
                </div>
            </div>
        );
    }
}

export default Allpost;
