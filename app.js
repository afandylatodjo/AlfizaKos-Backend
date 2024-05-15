require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT;

// Cors options to have cross origin access through different origin
let corsOptions = {
    origin: process.env.CORS_ORIGIN,
};
app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(express.json());

// Parse request of content-type - application/www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


// Whatsapp Bot for sending OTP
const {Client, LocalAuth} = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const client = new Client({
    authStrategy: new LocalAuth(
        {
            dataPath: "./wa-bot/login",
            clientId: "wa-otp-bot"
        }
    ),
    puppeteer: {
        headless: true,
        args: [ '--no-sandbox', '--disable-gpu', '--disable-setuid-sandbox'],
    },
    webVersionCache: { 
        type: 'remote', 
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html', 
    }
});


client.on('qr', (qr)=>{
    console.log("QR GENERATED!");
    qrcode.generate(qr, {small: true});
});

client.on("authenticated", (auth)=>{
    console.log("Client Logged In!");
})

client.on("ready", ()=>{
    console.log("Client is ready!");
})


client.initialize();
//




// Initialize DB
const dbConfig = {
    host: "localhost",
    user: "andy",
    passsword: "",
    db: "KosAlfiza",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
//

//Model
const MyUser = (sqlz, Sqlz) => {
    const User = sqlz.define("user", {
        user_name: {
            type: Sqlz.STRING
        },
        phone_number:{
            type: Sqlz.STRING
        },
    });
    return User;
}

const MyRole = (sqlz, Sqlz)=>{
    const Role = sqlz.define("role", {
        role:{
            type: Sqlz.ENUM("ADMIN", "PETUGAS", "PENGGUNA")
        }
    });
    return Role;
} 

const MyLoby = (sqlz, Sqlz)=>{
    const Loby = sqlz.define("lobie",{
        user_name:{
            type: Sqlz.STRING
        },
        phone_number:{
            type: Sqlz.STRING
        },
        otp:{
            type: Sqlz.STRING
        }
    })
    return Loby;
}

//

// Initialize Sequelize
const Sequelize = require("sequelize");
// const { CharsetToEncoding } = require("mysql2");

const sequel = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.passsword, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    operatorAliases: false,

    pool: {
        max: dbConfig.max,
        min: dbConfig.min,
        acquire: dbConfig.pool.acquire
    }
})
const db = {};

db.Sequelize = Sequelize;
db.sequel = sequel;
//

//TABLES

// TABLE of USERS
db.user = MyUser(sequel, Sequelize);
// TABLE of ROLES
db.role = MyRole(sequel, Sequelize);
const Role = db.role;
// Temporary TABLES for OTP Registration
db.loby = MyLoby(sequel, Sequelize);
//

// Relation
db.role.hasMany(db.user);
db.user.belongsTo(db.role);
//

function createRole(arrays){
    Role.bulkCreate(
       arrays 
    ).then(()=>{
    }).catch((err)=>{
        console.log(err);
    });
}

// Syncing DATABASE
db.sequel.sync({force: true}).then(() => {
    createRole([
        {role: "ADMIN"},
        {role: "PETUGAS"},
        {role: "PENGGUNA"},
    ])

    console.log("DB Re-Synced Successfuly");
}).catch((err) => {
    console.log("Failed to Sync DB with error:",err);
});
//

// Controller
const User = db.user;
const Op = db.Sequelize.Op;


function lobying(req, res){
    const Loby = db.loby;
    if(!req.body.user_name || !req.body.phone_number)
    {
        res.json({msg:"Username and Phone Number cannot be Empty!"}); 
        return;
    }
    
    Loby.create({
        user_name: req.body.user_name,
        phone_number: req.body.phone_number,
        otp: generateOTP(6).toString()
    }).then(({dataValues:{phone_number, otp}})=>{
        client.sendMessage(
            `${phone_number}@c.us`,
            "Kode OTP Anda adalah "+otp
        ).then(()=>{
            res.json({msg: "OTP Terkirim!"});
        }).catch((err)=>{
            res.json({msg: "OTP Tidak Terkirim: "+err.message});
        })
    }).catch((err)=>{
        res.json({msg:"Registrasi Gagal Mohon Coba lagi beberapa waktu"});
    });

}

function createUser(req, res) {
    // Validate Request
    if(!req.body.user_name || !req.body.phone_number){
        return;
    }

    let userData = {};
    Role.findByPk(
        req.body.roleId
    ).then((data)=>{
        userData = {
            user_name : req.body.user_name,
            phone_number: req.body.phone_number,
            roleId: data.dataValues.id    
        }


    }).then(()=>{
        User.create(userData)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                msg: "Something bad happened!"+err.message
            })
        });
    }).catch((err)=>{
        res.json({msg: "Cant find the Role ID"});
    })


}

function findAllUser(req, res){
    const userName =req.query.user_name;
    let condition = userFirstName ? {user_name: {[Op.like] : `%${userFirstName}%`} } : null;

    User.findAll({where: condition})
    .then((data) => {
        res.send(data);
    })
    .catch((err) => {
        res.status(500).send({
            msg: "Something bad happened!"
        });
    });
}

function findAllUserByCondition(req, res){
    const nameInclude = req.body.user_name;
    User.findAll({
        where:{user_name: nameInclude}
    })
    .then((data) => {
        res.send(data);
    })
    .catch((err) => {
        res.status(500).send({
            msg: "Error while retrieving users!"
        });
    });
}

function findOneUser(req, res){ 
    const id = req.params.id;

    User.findByPk(id)
    .then((data) => {
        if(data){
            res.send(data);
        }
        else{
            res.status(404).send({
                msg: `Cannot find user with id: ${id}`
            });
        }
    })
    .catch((err) => {
        res.status(500).send({
            msg: `Error while retrieving user with id: ${id}`
        });
    });
}

function updateUser(req, res){ 
    const id = req.params.id

    User.update(req.body, {
        where: {id: id}
    })
    .then((num) => {
        if(num == 1){
            res.send({
                msg: "User updated successfully!"
            })
        }
        else{
            res.send({
                msg: "Cannot update user!"
            })
        }
    })
    .catch((err) => {
        res.status(500).send({
            msg: `Error updating user with id: ${id}` 
        });
    });
}

function deleteUser(req, res){
    const id = req.params.id;

    User.destroy( {where: {id: id} } )
    .then((num) => {
        if(num == 1){
            res.send({
                msg: "User was deleted successfully"
            })
        }else{
            res.send({
                msg: "Cannot delete user!"
            });
        }
    })
    .catch((err) => {
        res.status(500).send({
            msg: `Cannot delete user with id: ${id}`
        });
    });
}

function deleteAllUser(req, res){
    User.destroy({
        where: {},
        truncate: false
    })
    .then((nums) => {
        res.send({
            msg: `${nums} users was deleted successfullyc`
        })
    })
    .catch((err) => {
        res.status(500).send({
            msg: "Error while removing all users"
        })
    })
}
//


//TODO: Send OTP
async function sendOTP({contactNumber, message}){
    client.sendMessage(
        contactNumber,
        message
    );
}

function generateOTP(otpLength){
    let digits = "0123456789";
    let OTP = "";
    for(let i=0; i<otpLength; i++){
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

async function getAndSendOTP(req, res){
    otp = generateOTP(6);
    console.log(req.body);
    sendOTP({
        contactNumber: `${req.body.number}@c.us`,
        message: "Kode OTP Anda adalah "+otp.toString() 
    }).then(()=>{
        res.json({
            type: "OTP",
            message: otp.toString()
        })
    })
}



// Routers
app.post("/register", lobying);

app.post("/create/user", createUser);

app.get("/user/:id", findOneUser);

app.get("/users", findAllUser);

app.get("/users/:id", findAllUserByCondition);

app.put("/update/user/:id", updateUser);

app.delete("/delete/user/:id", deleteUser);

app.delete("/delete/users", deleteAllUser);
//

// Getting OTP Kode 
// app.get("/register/otp", getAndSendOTP);
//

// POST number to get OTP
app.post("/register/otp", getAndSendOTP);

// Send Message
// app.get("/message/send", sendMessageToUser);


// const userRouter = express.Router();
// userRouter.get("/getUsers", (req, res) => {
//     res.send({ msg: "Users" });
// });

// userRouter.get("/getUserById/:id", (req, res) => {
//     res.send({ msg: `User number ${req.params.id}` });
// });

// app.use("/user", userRouter);



app.listen(port, () => {
    console.log("Server listening in port,",port);
})
