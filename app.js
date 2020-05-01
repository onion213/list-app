const express = require("express");
const mysql = require("mysql");
const app_params = require("./params.json");

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const connection = mysql.createConnection(app_params.mysql);
connection.connect((err) => {
    if(err) {
        console.error("database connection error: " + err.stack);
        return;
    }
    console.log("database connection success");
});

app.get("/", (req, res) => {
    res.redirect("/top");
});

app.get("/top", (req, res) => {
    res.render("top.ejs");
});

app.get("/list", (req, res) => {
    connection.query(
        "SELECT * FROM items",
        (error, results) => {
            res.render("list.ejs", {items: results});
        }
    );
});

app.get("/add", (req, res) => {
    res.render("add.ejs");
});

app.post("/add", (req, res) => {
    connection.query(
        "INSERT INTO items(content) VALUES(?)",
        [req.body.content],
        (error, results) => {
            res.redirect("/list");
        }
    );
});

app.get("/update/:id", (req, res) => {
    connection.query(
        "SELECT * FROM items WHERE id = ?",
        [req.params.id],
        (error, results) => {
            res.render("update.ejs", {item: results[0]});
        }
    );
});

app.post("/update/:id", (req, res) => {
    connection.query(
        "UPDATE items SET content = ? WHERE id = ?",
        [req.body.content, req.params.id],
        (error, results) => {
            res.redirect("/list");
        }
    );
});

app.post("/delete/:id", (req, res) => {
    connection.query(
        "DELETE FROM items WHERE id = ?",
        [req.params.id],
        (error, results) => {
            res.redirect("/list")
        }
    );
});

app.listen(3000);