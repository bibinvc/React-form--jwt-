const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const bodyParser = reuire("body-parser");
const cookieParser =  require("cookie-parser");
const session =  require("express-session");

const bcrypt = require("bcrypt");
const saltRounds = 10;


const  jwt = require('jsonwebtoken')


const app = express();

app.use(express.json());
app.use(
    cors({
        origin: ["http://localcost:3000"],
        methods: ["GET", "POST"],
        credentials:true,
    })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(
    session({
        key:"userId",
        secret:"subscribe",
        resave:false,
        saveUninitialized: false,
        cookie:
    })
)
app.use(express.json());
app.use(cors());

//databse connection

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password:"root",
    database: "loginsystem",
});
//registration
app.post('/register', (req, res) => {

    const username= req.body.username;
    const email= req.body.email;
    const password= req.body.password;

    db.query(
        "INSERT INTO users (username,email, password) VALUES(?, ?, ?)", 
    [username, email, password],
    (err, result)=> {
        console.log(err);

    }
  );
});
});

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]

    if(!token){
        res.send("we need a token ");

    }else {
        jwt.verify(token, "jwtSecret", (err, decoded) => {
            if (err) {
                res.json({})
            }
        })
    }
}

app.get('/isUserAuth', verifyJWT, (req, res)=>{
    res.send("ou are authenicated")
})
app.get("/login",(req, res) =>  {
    if(req.session.user) {
        res.send({ loggedIn: true, user: req.session.user });
    }else {
        res.send({loggedIn: false });
    }
    });
//login
app.post('/login', (req,res)=> {

    const username= req.body.username;
    const password= req.body.password;

    db.query(
        "SELECT * FROM users WHERE username = ?  AND PASSWORD = ?", 
        [username, password],
        (err, result) => {
            if(err){
                res.send({err: err})
            } 
            
            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (error, response) => {
                    if (response) {
                        
                        const id = result[0].id
                        const token = jwt.sign({id}, "jwtSecret", {
                            expiresIn: 300, 
                        })
                        req.session.user = result;

                        res.json({auth: true, token, result: result});  
            } else {
                res.send({ message: "incorrect username and password!"});


            }
        });
    } else {
        res.send({ message: "User does not exist"});
    }
}
    );

});
app.listen(3001, () => {
    console.log("server");

});