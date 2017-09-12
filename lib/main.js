"use strict";

let MongoClient = require("mongodb").MongoClient;
let http = require("http");
const fs = require("fs");
let URL = require("url");
let qs = require("querystring");

const DB_CONN_STR = "mongodb://localhost:27017/test";

let getData = function(db, title, callback) {
    // 连接到表 site
    let collection = db.collection("site");
    var where = {
        title: title,
    };

    collection.find(where).toArray(function(err, result) {
        if (err) {
            console.log("Error:" + err);
            return;
        }
        callback(result);
    });
};

let server = http.createServer((req, res) => {
    let url = URL.parse(req.url);
    let pn = url.pathname;
    let search = qs.parse(url.query);
    switch (true) {
        case /^\/article\/[\w\-]+$/.test(pn):
            var ret;
            fs.readFile(__dirname + "/../blog.html", "utf8", (err, data) => {
                if (err === null) {
                    ret = data;
                } else {
                    ret = err.stack;
                }
                res.writeHead(200, {
                    "Content-Type": "text/html; charset=UTF-8",
                    "Content-Length": ret.length,
                });
                res.end(ret);
            });
            break;
        case pn === "/blog":
            MongoClient.connect(DB_CONN_STR, function(err, db) {
                if(err) {
                    res.writeHead(502);
                    res.end(err.stack);
                    console.log(new Date(), "- 502 -", err.stack)
                    return;
                }
                getData(db, search.title, function(result) {
                    db.close();
                    let obj = result[0];
                    if(obj === null || obj === undefined) {
                        obj = {};
                        console.log(new Date().toJSON() + " - 502 - obj is null or undefined; search.title =", search.title);
                    }
                    delete obj._id;
                    obj.title = search.title;
                    let json = JSON.stringify(obj);
                    res.writeHead(200, {
                        "Content-Type": "application/json; charset=UTF-8",
                        "Content-Length": json.length,
                    });
                    res.end(json);
                });
            });
            break;
        case /\.js$/.test(pn):
            fs.readFile(__dirname + "/.." + pn, (err, data) => {
                if (err !== null) {
                    res.end(err.stack);
                    return;
                }
                res.writeHead(200, {
                    "Content-Type": "application/javascript"
                });
                res.end(data);
            });
            break;
        case /\.css$/.test(pn):
            fs.readFile(__dirname + "/.." + pn, (err, data) => {
                if (err !== null) {
                    res.end(err.stack);
                    return;
                }
                res.writeHead(200, {
                    "Content-Type": "text/css"
                });
                res.end(data);
            });
            break;
        case /(\.jpg|\.png|\.gif)/.test(pn):
            // console.log(__dirname + "/.." + pn)
            fs.readFile(__dirname + "/.." + pn, (err, data) => {
                if (err !== null) {
                    res.end(err.stack);
                    return;
                }
                res.writeHead(200, {
                    "Content-Type": getType(pn)
                });
                res.end(data);
            });
            break;
        default:
            res.writeHead(404);
            res.end("404 Not Found");
    }
});

function getType(str) {
    let ext = str.split(".").pop() || "";
    return {
        gif: "image/gif",
        jpg: "image/jpeg",
        png: "application/x-png"
    }[ext];
}

server.listen(8888);

console.log("Server listening at port 8888...");
