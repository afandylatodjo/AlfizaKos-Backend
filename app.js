const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

// Cors options to have cross origin access through different origin
let corsOptions={
    origin: "*",
};
app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(express.json());

// Parse request of content-type - application/www-form-urlencoded
app.use(express.urlencoded({extended: true}));

const dbConfig = {
    host: "localhost",
    user: "root",
    passsword: "",
    db: "AlfizaKos",
    dialect: "mysql",
    pool:{
        max:5,
        min:0,
        acquire: 30000,
        idle: 10000
    }
};

const Sequelize = require("sequelize");

const sequel = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.passsword, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    operatorAliases: false,

    pool:{
        max: dbConfig.max,
        min: dbConfig.min,
        acquire: dbConfig.pool.acquire
    }
})
const db = {};

db.Sequelize = Sequelize;
db.sequel = sequel;

db.tutors = Model(sequel, Sequelize);

db.sequel.sync().then(()=>{
    console.log("DB Synced Successfuly");
}).catch((err)=>{
    console.log("Failed to Sync DB!");
});


// Basic simple route
app.get("/", async (req, res)=>{
    res.send({msg: "Hello from "})
});



const userRouter = express.Router();
userRouter.get("/getUsers", (req, res)=>{
    res.send({msg: "Users"});
});

userRouter.get("/getUserById/:id", (req, res)=>{
    res.send({msg: `User number ${req.params.id}`});
});

app.use("/user", userRouter);



app.listen(port, ()=>{
    console.log("Server listening in port,", port);
})
