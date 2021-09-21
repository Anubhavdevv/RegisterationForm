const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const port = process.env.PORT || 3000;
require("./db/database_connect");
const Register = require("./models/registers");



const static_path = path.join(__dirname, "../public/Css");
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended: false}));
// console.log(path.join(__dirname, "../public"));
app.use(express.static(static_path));
app.set("view engine", "hbs");

app.set("views", template_path);
hbs.registerPartials(partial_path)


app.get("/", (req, res) => {
    res.render("index")
});

app.get("/register", (req, res) =>{
    res.render("register");
});

app.get("/login", (req, res) =>{
    res.render("login");
})

app.post("/register", async (req, res) =>{
    try{
        const password = req.body.password;
        if(password){
            const registerEmployee = new Register ({
                Username: req.body.Username,
                email: req.body.email,
                password: req.body.password
            })

            const registered = await registerEmployee.save();
            res.status(201).render("index");
        }
        else{
            res.send("Please enter your password")
        }
    }catch (error){
        res.status(400).send(error);
    }
});

//Login Here
app.post("/login", async(req, res) =>{
    try {
        const email = req.body.username;
        const Password = req.body.password;

        const usermail = await Register.findOne({email: email});
        if(usermail.password === Password){
            res.status(201).render("home");
        }else{
            res.send("password are not matching");
        }

    } catch (error) {
        res.status(400).send("Invalid Email")
    }
    
});

app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
});
