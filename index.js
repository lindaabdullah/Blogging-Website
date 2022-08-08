// const path = require("path");
const express = require("express");
const app = express();
const db = require('better-sqlite3')('database.sqlite');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// cookie based authentication
// const authenticated = [];
// function authenticate(req, res, next) {
//     const cookie = req.cookies["loginCookie"];
//     if (!cookie) res.sendStatus(403);
//     const user = authenticated.filter(i => i?.cookie === cookie)[0];
//     if (!user) res.sendStatus(403);
//     req.user = user;
//     next();
// }

function authenticate(req, res, next) {
    const token = req.cookies["token"];
    try {
        const user = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = user;
        next();
    } catch (e) {

        res.sendStatus(403);
    }
}


app.listen(2000);
app.use(express.json());
app.use(cookieParser());

app.get("/api/authenticate", (res, req) => {
    authenticate;
});

app.post("/api/Add", authenticate, (req, res) => {
    const command = req.body;
    const {username} = req.user;
    const insert = db.prepare("INSERT INTO comments VALUES(@username, @postid, @postcomment)");
    // for(i of command) {i.username = username};
    command.username = username;
    console.log(command);
    res.json(insert.run(command));
});

app.post("/api/Addpost", authenticate, (req, res) => {
    console.log(req.body);
    const {SectionID, title, hashtag1, hashtag2, hashtag3, hashtag4, image, paragraph} = req.body;
    const {username} = req.user;
    const insert = db.prepare("INSERT INTO posts VALUES(@SectionID, @username, @title, @hashtag1, @hashtag2, @hashtag3, @hashtag4, @image, @paragraph)");
    insert.run({SectionID, username, title, hashtag1, hashtag2, hashtag3, hashtag4, image, paragraph});
    res.json(req.user);
});

app.get("/api/query", (req, res) => {
    var command = db.prepare("SELECT * FROM posts WHERE SectionID=(SELECT max(SectionID) FROM posts);").all();
    
    console.log(command);
    res.json(command);
});

app.get("/api/comment", (req, res) => {
    const { id } = req.body;
    const {username} = req.user;
    const row = db.prepare("select * from comments where postID=@id and username=@username").all({ id, username });
    // console.log(row);
    res.json(row);
    // res.json(row.run(req.body));
});

app.get("/api/all", authenticate, (req, res) => {
    const command = db.prepare("select * from posts").all();
    
    // command.forEach( i => i.username = username )
    res.json(command);
});

// send cookie
// user stores cookie
// user sends back cookie with every request
app.post("/api/login", (req, res) => {

    // user will take the request body and get username and password
    const { username, password } = req.body;

    // query the db and get the user
    const user = db.prepare("select * from user where username=@username and password=@password").get({ username, password });

    //javascript casts user to truthy if not undefined
    if (user) {

        // cookie based authentication
        // const cookie = Math.random().toString(16).substring(2);
        // authenticated.push({ user: user, cookie });
        // console.log(authenticated);
        // res.cookie("loginCookie", cookie);

        const token = jwt.sign(user, process.env.TOKEN_SECRET);
        res.cookie("token", token);
        res.json({ token });
   
    } else {
        res.sendStatus(403);
    }
});

app.get("/api/secret", authenticate, (req, res) => {
    console.log("asd");
    res.json(req.user);
});

app.post("/api/signup", (req, res) => {

    const signup = req.body;
    console.log(signup)
    const {SSN, name, surname, age, username, password} = req.body;

    const check = db.prepare("SELECT * FROM users WHERE SSN=@SSN;").get({SSN});
    
    console.log(check);

    if(SSN == "" || name == "" || surname == "" || age == null || username == "" || password == "" ){
        res.json({status: "missing information"});
    }
    else if (check) {
        res.json({status: "exists"});
        
    } else {
        const newUser = db.prepare("INSERT INTO users VALUES (@SSN, @name, @surname, @age, @username, @password);");
        newUser.run(signup);
        res.json({status: "SignUpSuccessful"});
    }  
});


app.get("/api/commentList", (req, res) => {
    const rows = db.prepare("SELECT * FROM comments").all();
    res.json(rows);
});

app.use(express.static("public"));

app.post("/api/delete", (req, res) => {
    const body = req.body;

    const deletePost = db.prepare("DELETE FROM posts where SectionID=@SectionID");
    deletePost.run(body);

    const deleteComments = db.prepare("DELETE FROM comments where postID=@SectionID");
    deleteComments.run(body);

});

app.post("/api/queryTest", (req, res) =>{

    const {username} = req.body;
    // const a = db.prepare("select * from comments").all();
    const b = db.prepare("select * from comments where username=@username").all({username});
    // const c = db.prepare("select * from comments where username=@username").get({username});
    // console.log(a);
    // console.log(c);
    res.json(b);
});