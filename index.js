const express = require("express");
const app = express();
app.use(express.static("./public"));
const db = require("./utils/db");
const s3 = require("./s3");
const config = require("./config");
// const bodyParser = require("body-parser");
// const cookieSession = require("cookie-session");
// const csurf = require("csurf");
// const helmet = require("helmet");
app.use(require("body-parser").json());
//
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.get("/images", (req, res) => {
    db.getImages()
        .then(results => {
            res.json(results.rows);
        })
        .catch(function(err) {
            console.log("err in getting img indexjs: ", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    // If nothing went wrong the file is already in the uploads directory
    // console.log(req.file);
    // res.json({file:req.file.filename})
    if (req.file) {
        const url = config.s3Url + req.file.filename;
        db.addImage(
            url,
            req.body.username,
            req.body.title,
            req.body.description
        )
            .then(data => {
                res.json({
                    data: data.rows[0]
                });
            })
            .catch(err => {
                console.log("error in adding image: ", err.message);
            });
    } else {
        res.json({
            success: false
        });
    }
});

app.get("/getDataForModal/:id", (req, res) => {
    console.log("req params: ", req.params);
    console.log(req.params.id);
    db.getDataForModal(req.params.id)
        .then(data => {
            console.log("that+s the data ", data);
            res.json(data.rows);
        })
        .catch(err => {
            console.log("The eerrroor is: ", err.message);
        });
});

app.post("/addComment", (req, res) => {
    console.log(req.body.users, req.body.comment, req.body.image_id);
    db.addComment(req.body.users, req.body.comment, req.body.image_id)
        .then(data => {
            console.log(data);
            res.json(data.rows);
        })
        .catch(err => {
            console.log("message is error from error to error:", err.message);
        });
});

app.get("/getComments/:id", (req, res) => {
    console.log(req.params.id);
    console.log(req.query.id);
    db.getComments(req.params.id)
        .then(results => {
            console.log("THESE ARE THE RESUUULTS", results.rows);
            res.json(results.rows);
        })
        .catch(function(err) {
            console.log("err in retrieving comments indexjs: ", err);
        });
});

app.get("/getMoreImages/:id", (req, res) => {
    console.log(req.params.id);
    db.getMoreImages(req.params.id)
        .then(results => {
            res.json(results);
            console.log("the newest results ever", results);
        })
        .catch(err => {
            console.log("the newest error", err.message);
        });
});

app.listen(8080, () => console.log("ich listen"));
