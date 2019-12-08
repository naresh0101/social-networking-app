var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var cors = require("cors");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
var dateTime = require("node-datetime");

app.use(cors());
app.use(bodyparser.json());
var jwt = require("jsonwebtoken");
// var nodemailer = require('nodemailer');
const env = require("dotenv").config();

var knex = require("knex")({
    client: process.env.db,
    connection: {
        host: process.env.hostname,
        user: process.env.dbroot,
        password: process.env.dbpass,
        database: process.env.dbname
    }
});

// createing users table if
function table_users() {
    knex.schema
        .createTable("users", function(table) {
            table.increments();
            table.text("username");
            //  table.text("dob")
            table.text("bio");
            table.text("gender");
            table.string("email");
            table.text("password");
            table.text("profile");
            table.text("totalpost");
            table.text("notifi"); //notification
        })
        .then(() => {
            console.log("userTable created -----------");
        })
        .catch(err => {
            console.error("user table exists ------------");
        });
}

function table_allpost() {
    knex.schema
        .createTable("allpost", function(table) {
            table.increments();
            table.text("username");
            table.string("email");
            //  table.text("dob")
            table.string("post"); //here will we link of post
            table.text("description");
            table.string("contentType");
            table.string("datetime");
            table.integer("like").defaultTo(0);
            table.integer("comments").defaultTo(0);
            table.string("postedbypic");
        })
        .then(respo => {
            console.log("table_allpost created -----------");
        })
        .catch(err => {
            console.error("table_allpost table exists ------------");
        });
}

function table_postaction() {
    knex.schema
        .createTable("managepostaction", function(table) {
            table.increments();
            table.string("postId");
            table.string("time");
            table.string("user_mail");
            //  table.text("dob")
            table.string("like_status").defaultTo(false); // this value will help   to know that user have not like the post
            table.text("comment");
        })
        .then(respo => {
            console.log("table_postaction created -----------");
        })
        .catch(err => {
            console.error("table_postaction table exists ------------");
        });
}
table_allpost();
table_users();
table_postaction();

//  register new user
app.post("/register", (req, res) => {
    table_users();
    knex.select("*")
        .from("users")
        .where("email", req.body.email)
        .then(data => {
            if (data.length === 0) {
                knex("users")
                    .insert(req.body)
                    .then(data => {
                        console.log(data, "--------------- data inserted ");
                        res.send({ result: true });
                        // res.send({token:jwt.sign(req.body.email,'KEywkjvbw')})
                    });
            } else {
                res.send({ result: false });
            }
        });
});

// login
app.post("/login", (req, res) => {
    knex.select("*")
        .from("users")
        .where("email", req.body.email)
        .then(data => {
            console.log(data);
            if (data.length > 0) {
                if (data[0].password == req.body.password) {
                    var token = jwt.sign({ email: data[0].email }, "qazkeymlp");
                    console.log("--------------  user loged in");
                    res.send({ result: true, Token: token });
                } else {
                    res.send({ result: false });
                }
            } else {
                res.send({ result: false });
            }
        })
        .catch(err => {
            console.log(err);
            res.send({ result: false });
        });
});

// this api is responsible for showing data login user and all post fetching
app.post("/home", (req, res) => {
    var email = jwt.verify(req.body.token, "qazkeymlp");
    knex.select("*")
        .from("users")
        .where("email", email.email)
        .then(packet => {
            res.send(packet);
        })
        .catch(err => {
            console.log(err);
            console.log("somthing went  wrong in home ");
        });
});

app.post("/profile", (req, res) => {
    var email = jwt.verify(req.body.token, "qazkeymlp");
    knex.select("*")
        .from("users")
        .where("email", email.email)
        .then(packet => {
            res.send(packet);
        })
        .catch(err => {
            console.log(err);
            console.log("somthing went  wrong in home ");
        });
});

// make post my media
var uploadFile = express.Router();
app.use("/", uploadFile);
require("./createpost")(uploadFile, multer, multerS3, aws, path);

app.get("/showallpost", (req, res) => {
    knex.select("*")
        .from("allpost")
        .then(packet => {
            if (packet.length > 0) {
                res.send({ result: true, data: packet });
            } else {
                res.send({ result: false });
            }
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/activityonpost", (req, res) => {
    var email = jwt.verify(req.body.token, "qazkeymlp");
    knex.select("*")
        .from("managepostaction")
        .where({ user_mail: email.email, like_status: 1 })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.send(err);
        });
});

//
app.post("/handlelike", (req, res) => {
    var email = jwt.verify(req.body.token, "qazkeymlp");
    knex("allpost")
        .where({ id: req.body.postId })
        .update({ like: req.body.like })
        .then(data => {
            console.log(data, "222");
            // res.send({result:true})
        })
        .catch(err => {
            console.log(err, "225");
            // res.send({result:false})
        });

    knex("managepostaction")
        .where({ postId: req.body.postId, user_mail: email.email })
        .update({ like_status: req.body.likestatus })
        .then(data => {
            console.log(typeof data, "under update qu.. from managepostaction", data);
            if (data == 0) {
                knex("managepostaction")
                    .insert({
                        user_mail: email.email,
                        postId: req.body.postId,
                        like_status: req.body.likestatus
                    })
                    .then(data => {
                        console.log(data, "under insert  qu... ");
                        return res.send({ result: true });
                    })
                    .catch(err => {
                        console.log(err, "242");
                        return res.send({ result: false });
                    });
            }
            else return res.send({ result: true });
        })
        .catch(err => {
            console.log(err, "234");
            res.send({ result: false });
        });
});

app.post("/savecomment", (req, res) => {
    var email = jwt.verify(req.body.token, "qazkeymlp");
    var dt = dateTime.create();
    var formatted = dt.format("Y-m-d H:M:S");

    knex("managepostaction")
        .insert({
            user_mail: email.email,
            postId: req.body.postId,
            comment: req.body.comment,
            time: formatted
        })
        .then(data => {
            knex("allpost")
                .where({ id: req.body.postId })
                .update({ comments: req.body.totalcomment })
                .then(data => {
                    res.send({ result: true });
                });
        })
        .catch(err => {
            console.log(err, "242");
            res.send({ result: false });
        });
});

app.post("/showcomment-on-post", (req, res) => {
    knex("managepostaction")
        .select("time", "comment", "user_mail")
        .where({ postId: req.body.postId })
        .whereNot({ comment: null })
        .then(data => {
            res.send({ result: true, data: data });
        })
        .catch(err => {
            res.send({ result: false });
        });
});

app.listen(7000, () => {
    console.log("server is started on port 7000..");
});
