let config = require("./config");
var dateTime = require("node-datetime");

var jwt = require("jsonwebtoken");

var knex = require("knex")({
    client: config.key.db,
    connection: {
        host: config.key.hostname,
        user: config.key.dbroot,
        password: config.key.dbpass,
        database: config.key.dbname
    }
});

module.exports = function(uploadFile, multer, multerS3, aws, path) {
    console.log(config.key.accessKeyId, config.key.secretAccessKey);
    const s3 = new aws.S3({
        accessKeyId: config.key.accessKeyId,
        secretAccessKey: config.key.secretAccessKey,
        Bucket: config.key.Bucket,
        region: "us-east-2"
    });

    const uploadsBusinessGallery = multer({
        storage: multerS3({
            s3: s3,
            bucket: "social-media-naresh",
            acl: "public-read",
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: function(req, file, cb) {
                cb(
                    null,
                    path.basename(
                        file.originalname,
                        path.extname(file.originalname)
                    ) +
                        "-" +
                        Date.now() +
                        path.extname(file.originalname)
                );
            }
        }),
        fileFilter: function(req, file, cb) {
            checkFileType(file, cb);
        }
    }).array("files", 1);
    function checkFileType(file, cb) {
        // Allowed ext
        const filetypes = /jpeg|png|svg|jpg|mp4/;
        // Check ext
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        // Check mime
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb("Error: Images And vedios Only!");
        }
    }

    uploadFile.post("/uploadFile", (req, res, next) => {
        uploadsBusinessGallery(req, res, error => {
            var email = jwt.verify(req.body.token, "qazkeymlp");

            if (error) {
                res.json({ error: error });
            } else {
                // If File not found
                if (req.files === undefined) {
                    console.log("Error: No File Selected!");
                    res.json("Error: No File Selected");
                } else {
                    let fileArray = req.files;
                    // console.log(fileArray);

                    knex.select("*")
                        .from("users")
                        .where("email", email.email)
                        .then(data => {
                            if (data.length > 0) {
                                var dt = dateTime.create();
                                var formatted = dt.format("Y-m-d H:M:S");

                                var newpost = {
                                    username: data[0]["username"],
                                    email: data[0]["email"],
                                    post: fileArray[0]["location"].slice(
                                        55,
                                        fileArray[0]["location"].lenght
                                    ),
                                    description: req.body.postdescription,
                                    contentType: fileArray[0]["contentType"],
                                    datetime: formatted,
                                    postedbypic: data[0]["profile"]
                                };

                                knex("allpost")
                                    .insert(newpost)
                                    .then(data => {
                                        res.json({ result: true });
                                    })
                                    .catch(err => {
                                        console.log(
                                            err,
                                            "----------------------------------------------------"
                                        );
                                        res.json({ result: false });
                                    });
                            }
                        })
                        .catch(err => {
                            res.json({ errormsg: "opps! somthing went wrong" });
                            console.log(err, "somthing err");
                        });

                    // res.send({file:fileArray})
                }
            }
        });
    });
};
