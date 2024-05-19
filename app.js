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
// const {Client, LocalAuth} = require("whatsapp-web.js");
// const qrcode = require("qrcode-terminal");
// const client = new Client({
//     authStrategy: new LocalAuth(
//         {
//             dataPath: "./wa-bot/login",
//             clientId: "wa-otp-bot"
//         }
//     ),
//     puppeteer: {
//         headless: true,
//         args: [ '--no-sandbox', '--disable-gpu', '--disable-setuid-sandbox'],
//     },
//     webVersionCache: { 
//         type: 'remote', 
//         remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html', 
//     }
// });


// client.on('qr', (qr)=>{
//     console.log("QR GENERATED!");
//     qrcode.generate(qr, {small: true});
// });

// client.on("authenticated", (auth)=>{
//     console.log("Client Logged In!");
// })

// client.on("ready", ()=>{
//     console.log("Client is ready!");
// })


// client.initialize();
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

//Model - Start
const MyUser = (sqlz, Sqlz) => {
    const User = sqlz.define("user", {
        user_name: {
            type: Sqlz.STRING
        },
        phone_number:{
            type: Sqlz.STRING
        },
        password:{
            type: Sqlz.STRING
        }
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
        password:{
            type: Sqlz.STRING
        },
        otp:{
            type: Sqlz.STRING
        },
        role_id:{
            type: Sqlz.STRING
        }
    });

    return Loby;
}


const MyRoomFacility = (sqlz, Sqlz)=>{
    const Facility = sqlz.define("facilitie", {
        facility : {
            type: Sqlz.STRING
        }
    });
    return Facility;
}

const MyRoomFloor = (sqlz, Sqlz)=>{
    const Floor = sqlz.define("floor",{
        floor:{
            type: Sqlz.ENUM("LANTAI_1", "LANTAI_2")
        }
    })
    return Floor;
}

const MyRoom = (sqlz, Sqlz)=>{
    const Room = sqlz.define("room", {
        room_number: {
            type: Sqlz.STRING
        },
    });
    return Room;
}

// Model - End

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
// TABLE of FLOORS
db.floor = MyRoomFloor(sequel, Sequelize);
const Floor = db.floor;
// TABLE of FACILITIES
db.facility = MyRoomFacility(sequel, Sequelize);
// TABLE of ROOMS
db.room = MyRoom(sequel, Sequelize);
//



// Relation
db.role.hasMany(db.user);
db.user.belongsTo(db.role);

db.floor.hasMany(db.room);
db.room.belongsTo(db.floor);

db.room.hasMany(db.facility);
db.facility.belongsTo(db.room);

db.room.hasMany(db.user);
//

function createRole(arrays){
    Role.bulkCreate(
       arrays 
    ).then(()=>{
    }).catch((err)=>{
        console.log(err.message);
    });
}

function createFloor(arrays){
   Floor.bulkCreate(arrays)
   .then()
   .catch((err)=>{
    console.log(err.message);
   });
}

// Syncing DATABASE
db.sequel.sync({force: true}).then(() => {
    createRole([
        {role: "ADMIN"},
        {role: "PETUGAS"},
        {role: "PENGGUNA"},
    ]);
    createFloor([
        {floor: "LANTAI_1"},
        {floor: "LANTAI_2"}
    ]);

    console.log("DB Re-Synced Successfuly");
}).catch((err) => {
    console.log("Failed to Sync DB with error:",err);
});
//

//  User Controller
const User = db.user;
const Op = db.Sequelize.Op;

//Generate OTP
function generateOTP(otpLength){
    let digits = "0123456789";
    let OTP = "";
    for(let i=0; i<otpLength; i++){
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

//Encrypt User Password
function encryptPassword(word, rounds){
    const bcrypt = require("bcrypt");
    const password = bcrypt.hashSync(word, rounds);
    return password;
}


function lobying(req, res){
    const Loby = db.loby;
    if(!req.body.user_name || !req.body.phone_number || !req.body.password)
    {
        res.json({msg:"Username and Phone Number cannot be Empty!", status: "OK"}); 
        return;
    }
    
    
    Loby.create({
        user_name: req.body.user_name,
        phone_number: req.body.phone_number,
        password: encryptPassword(req.body.password, 8),
        otp: generateOTP(6).toString(),
        role_id: req.body.role_id || "3"
    }).then(({dataValues:{phone_number, otp}})=>{
        console.log(phone_number);
        res.json({msg: phone_number, code: otp});
        // client.sendMessage(
        //     `${phone_number}@c.us`,
        //     "Kode OTP Anda adalah "+otp
        // ).then(()=>{
        //     res.json({msg: "OTP Terkirim!"});
        // }).catch((err)=>{
        //     res.json({msg: "OTP Tidak Terkirim: "+err.message});
        // })
    }).catch((err)=>{
        res.json({msg:"Registrasi Gagal Mohon Coba lagi beberapa waktu"});
    });

}

function validateOTP(req, res, next){
    const otp = req.params.otp;
    const Loby = db.loby;

    Loby.findAll({where:{otp: otp}})
    .then((user)=>{
        res.locals.loby = Loby;
        res.locals.id = user[0].dataValues.id;
        res.locals.otp = otp;
    })
    .then(()=>{
        next();
    }).catch((e)=>{
        res.json({msg: "Invalid OTP!"});
    })
}

async function destroyUserLobyById(res, res){
    const Loby = res.locals.loby;
    const id = res.locals.id;
    const otp = res.locals.otp;
    
    Loby.findAll({where:{id:id, otp: otp}})
    .then(async (data)=>{
        const userName = data[0].dataValues.user_name;
        const phoneNumber = data[0].dataValues.phone_number;
        const password = data[0].dataValues.password;
        const roleId = data[0].dataValues.role_id;

        await createUserAfterLobyFound(userName, phoneNumber, password, roleId)
        .then(()=>{
            Loby.destroy({where:{id:id, otp:otp}})
            .then((e)=>{
                res.json({msg: "Destroyed from Loby", status: "OK"});
            });
        })
        .catch((error)=>{
            res.json({msg: "Cannot create user!"});
        }); 
    })
    .catch((e)=>{
        res.json({msg: "Invalid OTP"});
    });
}
async function createUserAfterLobyFound(userName, phoneNumber, password, roleID){
    let userData = {};

    if(!userName || !phoneNumber){
        return;
    }
    Role.findByPk(roleID)
    .then((data)=>{
        userData = {
            user_name: userName,
            phone_number: phoneNumber,
            password: password,
            roleId: roleID
        };
    })
    .then(()=>{
        User.create(userData)
        .then((data)=>{
            console.log({msg: "User Created!"})
        })
        .catch((e)=>{
            console.log(e.message)
        })
    })
    .catch((e)=>{
        console.log({msg: "Cannot Find Role ID: "+e.message});
    });
}


//Deprecated - start
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
//Deprecated - end

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
            res.send({ msg: "User updated successfully!" })
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


//Login - Start
async function login(req, res){
    const bcrypt = require("bcrypt");
    const jwt = require("jsonwebtoken");
    let isUser = false;

    const userName = req.body.user_name;
    const phoneNumber = req.body.phone_number;
    const password = req.body.password;
    let roleID;
    let accessToken;
    
    User.findOne({where:{user_name: userName, phone_number: phoneNumber}})
    .then((user)=>{
        if(bcrypt.compareSync(password, user.dataValues.password)){
            roleID = user.roleId;
            accessToken = jwt.sign(
                {id: user.dataValues.id}, 
                "SECRET_CODE", 
                {
                    algorithm: "HS256",
                    allowInsecureKeySizes: true
                }
            );
            isUser= true;
        }
    })
    .then((data)=>{
        if(isUser){
            res.json({
                user_name: userName,
                phone_number: phoneNumber,
                role: roleID,
                token: accessToken
            });
        }
    })
    .catch((err)=>{
        console.log(err.message);
        res.json({
            msg: "User or Password Wrong!",
            token: null
        });
    })
}
//Login - End

//

// Routers
// Lobying Router for OTP, Register, Validating OTP and Creating User
app.post("/register", lobying);
app.delete("/register/user/:otp", validateOTP, destroyUserLobyById); //User created after destroyed 


// User Router
// app.post("/create/user", createUser);

//Get Users - Start
app.get("/user/:id", findOneUser);

app.get("/users", findAllUser);

app.get("/users/:id", findAllUserByCondition);

app.put("/update/user/:id", updateUser);

app.delete("/delete/user/:id", deleteUser);

app.delete("/delete/users", deleteAllUser);
// Get Users - End


// Login user - Start
app.post("/login", login);
// Login user - End

//

// Rooms Controller - Start
async function createRoom(req, res){

}
// Rooms Controller - End

// Rooms Router - Start
app.get("/room/create");
// Rooms Router - End


// Getting OTP Kode 
// app.get("/register/otp", getAndSendOTP);
//

// app.use("/user", userRouter);



app.listen(port, () => {
    console.log("Server listening in port,",port);
})
