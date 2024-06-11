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
    db: "kosalfiza",
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
        phone_number: {
            type: Sqlz.STRING
        },
        email: {
            type: Sqlz.STRING
        },
        password: {
            type: Sqlz.STRING
        }
    });
    return User;
}
const MyUserPict = (sqlz, Sqlz) => {
    const UserPict = sqlz.define("user_pict", {
        image_path: {
            type: Sqlz.STRING
        }
    });
    return UserPict;
}

const MyRole = (sqlz, Sqlz) => {
    const Role = sqlz.define("role", {
        role: {
            type: Sqlz.ENUM("ADMIN", "PETUGAS", "PENGGUNA")
        }
    });
    return Role;
}

const MyLoby = (sqlz, Sqlz) => {
    const Loby = sqlz.define("lobie", {
        user_name: {
            type: Sqlz.STRING
        },
        phone_number: {
            type: Sqlz.STRING
        },
        email: {
            type: Sqlz.STRING
        },
        password: {
            type: Sqlz.STRING
        },
        otp: {
            type: Sqlz.STRING
        },
        role_id: {
            type: Sqlz.STRING
        }
    });

    return Loby;
}


const MyRoomFacility = (sqlz, Sqlz) => {
    const Facility = sqlz.define("facilitie", {
        item: {
            type: Sqlz.STRING
        },
    });
    return Facility;
}

const MyRoomFloor = (sqlz, Sqlz) => {
    const Floor = sqlz.define("floor", {
        floor: {
            type: Sqlz.ENUM("LANTAI_1", "LANTAI_2")
        }
    })
    return Floor;
}

const MyRoom = (sqlz, Sqlz) => {
    const Room = sqlz.define("room", {
        room_number: {
            type: Sqlz.STRING
        },
        room_price: {
            type: Sqlz.STRING
        },
        avail: {
            type: Sqlz.TINYINT(1),
            allowNull: false,
            defaultValue: 1
        }
    });
    return Room;
}

const MyRent = (sqlz, Sqlz) => {
    const Rent = sqlz.define("rent", {
        start_date: {
            type: Sqlz.STRING
        },
        end_date: {
            type: Sqlz.STRING
        },
        paid: {
            type: Sqlz.TINYINT(1),
            allowNull: false,
            defaultValue: 0
        },
        is_verified: {
            type: Sqlz.TINYINT(1),
            allowNull: false,
            defaultValue: 0
        }

    });
    return Rent;

}

const MyProof = (sqlz, Sqlz) => {
    const Proof = sqlz.define("proof", {
        image_path: {
            type: Sqlz.STRING
        }
    });
    return Proof;
}

const MySubscribe = (sqlz, Sqlz) => {
    const Subs = sqlz.define("subscribe", {
        due: {
            type: Sqlz.STRING
        }
    })
    return Subs;
}

const MyNotification = (sqlz, Sqlz) => {
    const Notif = sqlz.define("notification", {
        title: {
            type: Sqlz.STRING(64)
        },
        content: {
            type: Sqlz.STRING(1000)
        },
        is_read: {
            type: Sqlz.TINYINT(1),
            allowNull: false,
            defaultValue: 0
        },

    })
    return Notif;
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
// TABLE of USERPICTS
db.upicts = MyUserPict(sequel, Sequelize);
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
// TABLE of RENTS
db.rent = MyRent(sequel, Sequelize);
const Rent = db.rent;
// TABLE of PAYMENT PROOF
db.proof = MyProof(sequel, Sequelize);
// TABLE of SUBSCRIBE
db.subs = MySubscribe(sequel, Sequelize);
// TABLE of NOTIFICATION
db.notif = MyNotification(sequel, Sequelize);
//


// Relation
db.role.hasMany(db.user);
db.user.belongsTo(db.role);

db.upicts.hasOne(db.user);
db.user.belongsTo(db.upicts);

db.floor.hasMany(db.room);
db.room.belongsTo(db.floor);

db.room.hasMany(db.facility);
db.facility.belongsTo(db.room);

db.user.hasMany(db.room);

db.user.hasMany(db.rent);
db.rent.belongsTo(db.room);
db.rent.belongsTo(db.user);

db.user.hasMany(db.proof);
db.proof.belongsTo(db.room);

db.user.hasMany(db.subs);
db.rent.hasMany(db.subs);
db.room.hasMany(db.subs);
db.subs.belongsTo(db.user);

db.user.hasMany(db.notif);
db.notif.belongsTo(db.room);
db.notif.belongsTo(db.rent);
db.notif.belongsTo(db.user);
//


function createRole(arrays) {
    Role.bulkCreate(
        arrays
    ).then(() => {
        console.log("Role Created");
    }).catch((err) => {
        console.log(err.message);
    });
}

function createFloor(arrays) {
    Floor.bulkCreate(arrays)
        .then(() => {
            console.log("Role Created");
        })
        .catch((err) => {
            console.log(err.message);
        });
}

function createRooms(array) {
    const Room = db.room;
    Room.bulkCreate(array)
        .then(() => {
            console.log("Room Created");
        })
        .catch((err) => {
            console.log(err.message);
        });
}

// Syncing DATABASE
db.sequel.sync({ force:true }).then(() => {
    createRole([
        { role: "ADMIN" },
        { role: "PETUGAS" },
        { role: "PENGGUNA" },
    ]);
    User.create({
        "user_name": "AlfizaKos",
        "phone_number": "628123456789",
        "email": "AlfizaKos@gmail.com",
        "password": encryptPassword("kosalfiza123", 8),
        "roleId": 1,
    });
    createFloor([
        { floor: "LANTAI_1" },
        { floor: "LANTAI_2" }
    ]);
    let rooms = []
    for (let i = 1; i <= 20; i++) {
        if (i > 10) {
            rooms.push(
                {
                    "room_number": i.toString(),
                    "room_price": "800000",
                    "avail": 1,
                    "floorId": 2
                }
            );
        } else {
            rooms.push(
                {
                    "room_number": i.toString(),
                    "room_price": "800000",
                    "avail": 1,
                    "floorId": 1
                }
            );
        }
    }
    createRooms(rooms);


    console.log("DB Re-Synced Successfuly");
}).catch((err) => {
    console.log("Failed to Sync DB with error:", err);
});
//

//  User Controller
const User = db.user;
const Op = db.Sequelize.Op;

//Generate OTP
function generateOTP(otpLength) {
    let digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < otpLength; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

//Encrypt User Password
function encryptPassword(word, rounds) {
    const bcrypt = require("bcrypt");
    const password = bcrypt.hashSync(word, rounds);
    return password;
}


function lobying(req, res) {
    const Loby = db.loby;
    if (!req.body.userName || !req.body.phoneNumber || !req.body.password) {
        res.json({ msg: "Username and Phone Number cannot be Empty!", status: "OK" });
        return;
    }


    Loby.create({
        user_name: req.body.userName,
        phone_number: req.body.phoneNumber,
        email: req.body.email,
        password: encryptPassword(req.body.password, 8),
        otp: generateOTP(6).toString(),
        role_id: req.body.role_id || "3"
    }).then(({ dataValues: { phone_number, otp } }) => {
        res.json({ msg: phone_number, code: otp, status: "OK" });
        // console.log(phone_number);
        // client.sendMessage(
        //     `${phone_number}@c.us`,
        //     "Kode OTP Anda adalah "+otp
        // ).then(()=>{
        //     res.json({msg: "OTP Terkirim!", status: "OK"});
        // }).catch((err)=>{
        //     res.json({msg: "OTP Tidak Terkirim: "+err.message});
        // })
    }).catch((err) => {
        res.json({ msg: "Registrasi Gagal Mohon Coba lagi beberapa waktu" });
    });

}

function validateOTP(req, res, next) {
    const otp = req.params.otp;
    const Loby = db.loby;

    Loby.findAll({ where: { otp: otp } })
        .then((user) => {
            res.locals.loby = Loby;
            res.locals.id = user[0].dataValues.id;
            res.locals.otp = otp;
        })
        .then(() => {
            next();
        }).catch((e) => {
            res.json({ msg: "Invalid OTP!" });
        });
}

async function destroyUserLobyById(res, res) {
    const Loby = res.locals.loby;
    const id = res.locals.id;
    const otp = res.locals.otp;

    Loby.findAll({ where: { id: id, otp: otp } })
        .then(async (data) => {
            const userName = data[0].dataValues.user_name;
            const phoneNumber = data[0].dataValues.phone_number;
            const password = data[0].dataValues.password;
            const email = data[0].dataValues.email;
            const roleId = data[0].dataValues.role_id;

            await createUserAfterLobyFound(userName, phoneNumber, email, password, roleId)
                .then(() => {
                    Loby.destroy({ where: { id: id, otp: otp } })
                        .then((e) => {
                            res.json({ msg: "Destroyed from Loby", status: "OK" });
                        });
                })
                .catch((error) => {
                    res.json({ msg: "Cannot create user!" });
                });
        })
        .catch((e) => {
            res.json({ msg: "Invalid OTP" });
        });
}

async function createUserAfterLobyFound(userName, phoneNumber, email, password, roleID) {
    let userData = {};

    if (!userName || !phoneNumber || !email) {
        return;
    }
    Role.findByPk(roleID)
        .then((data) => {
            userData = {
                user_name: userName,
                phone_number: phoneNumber,
                email: email,
                password: password,
                roleId: roleID
            };
        })
        .then(() => {
            User.create(userData)
                .then((data) => {
                    console.log({ msg: "User Created!" })
                })
                .catch((e) => {
                    console.log(e.message)
                })
        })
        .catch((e) => {
            console.log({ msg: "Cannot Find Role ID: " + e.message });
        });
}


//Deprecated - start
function createUser(req, res) {
    // Validate Request
    if (!req.body.user_name || !req.body.phone_number) {
        return;
    }

    let userData = {};
    Role.findByPk(
        req.body.roleId
    ).then((data) => {
        userData = {
            user_name: req.body.user_name,
            phone_number: req.body.phone_number,
            roleId: data.dataValues.id
        }


    }).then(() => {
        User.create(userData)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    msg: "Something bad happened!" + err.message
                })
            });
    }).catch((err) => {
        res.json({ msg: "Cant find the Role ID" });
    })


}
//Deprecated - end

function findAllUser(req, res) {
    // const userName =req.query.user_name;
    // let condition = userName ? {user_name: {[Op.like] : `%${userName}%`} } : null;

    User.findAll()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.json({ msg: "Users Empty", status: "empty" });
            // res.status(500).send({
            //     msg: "Something bad happened!"
            // });
        });
}

function findAllUserByCondition(req, res) {
    // const nameInclude = req.body.userName;
    const userRole = req.params.roleId;
    User.findAll({
        where: { roleId: userRole }
    })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.json({ msg: "Users empty!", status: "empty" });
            // res.status(500).send({
            //     msg: "Error while retrieving users!"
            // });
        });
}

function findOneUser(req, res) {
    const userName = req.params.username;

    User.findOne({ where: { user_name: userName } })
        .then((user) => {
            if (user) {
                const data = {
                    "user_name": user.username,
                    "email": user.email,
                    "phone_number": user.phone_number,
                    "role": user.roleId == 1 ? "admin" : "user",
                };
                // console.log(data);
                // user_name
                res.send(data);
            }
            else {
                res.status(404).send({
                    msg: `Cannot find user with username: ${userName}`
                });
            }
        })
        .catch((err) => {
            console.log(err.message);
            res.status(500).send({
                msg: `Error while retrieving user`
            });
        });
}

function findUserById(req, res) {
    const User = db.user;
    let result = {};
    User.findOne({ where: { id: id } })
        .then((user) => {
            result = {
                user_name: user.user_name,
                phone_number: user.phone_number,
                email: user.email,
                role: user.roleId,
            }
            res.json(result);
        })
        .catch((err) => {
            res.json({ msg: "Cannot Find User", status: "empty" });
        });

}

function updateUser(req, res) {
    const userName = req.params.username;

    User.update({
        user_name: req.body.username,
        phone_number: req.body.phonenumber,
        email: req.body.email,
        password: encryptPassword(req.body.password, 8)
    }, {
        where: { user_name: userName }
    })
        .then((num) => {
            if (num == 1) {
                res.json({ msg: "User updated successfully!", status: "OK" });
            }
            else {
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

function deleteUser(req, res) {
    const id = req.params.id;

    User.destroy({ where: { id: id } })
        .then((num) => {
            if (num == 1) {
                res.send({
                    msg: "User was deleted successfully"
                })
            } else {
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

function deleteAllUser(req, res) {
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

// User Profile Controller - Start
// Saving image of user pict - Start
const multerPict = require("multer");
const pathPict = require("path");
const diskStoragePict = multerPict.diskStorage({
    // Save to destinate folder
    destination: function (req, file, cb) {
        cb(null, pathPict.join(__dirname, "./uploads/profile-pict/"));
    },
    // Save to folder with custom filename
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + req.params.username.toString().replace(" ", "").trim() + "_user" + path.extname(file.originalname));
    },
});


async function savePictToDB(req, res) {
    const Pict = db.upicts;
    const User = db.user;
    const username = req.params.username;

    if (!username) {
        return;
    }
    const imagePath = path.join(__dirname, ("./uploads/profile-pict/" + "profile-pict" + username.toString().replace(" ", "").trim() + "_user.jpg"));

    User.findOne({ where: { user_name: username } })
        .then((user) => {
            Pict.create({
                image_path: imagePath,
            })
                .then((pict) => {
                    user.update({ userPictId: pict.id })
                        .then((user) => {
                            res.json({ msg: "Image Saved to DB", status: "OK" });
                        })
                })
                .catch(err => {
                    res.json({ msg: "Cannot save image!" + err.message });
                })
        })
}
async function uploadProfilePict(req, res) {

}

async function getProfilePict(req, res) {
    const User = db.user;
    const Pict = db.upicts;
    const username = req.params.username;

    User.findOne({ where: { user_name: username } })
        .then((user) => {
            if (user.userPictId == null) {
                const image = pathPict.join(__dirname, ("./uploads/profile-pict/image_placeholder.jpg"));
                res.sendFile(image);
            } else {
                Pict.findOne({ where: { id: user.PictId } })
                    .then((pict) => {
                        res.sendFile(pict.image_path);
                    })
                    .catch((err) => {
                        res.json({ msg: "Cannot find user picture", status: "empty" });
                    });
            }
        })
        .catch((err) => {
            res.json({ msg: "Cannot find user", status: "empty" });
        })


}
// User Profile Controller - End
// User Profile Route - Start
app.put("/user/profile/upload/:username", multerPict({ storage: diskStoragePict }).single("profile-pict"), savePictToDB, acceptFile);
// app.put("/user/profile/upload/:username", uploadProfilePict);
app.get("/user/profile/:username", getProfilePict);
// User Profile Route - End

//Login - Start
async function login(req, res) {
    const bcrypt = require("bcrypt");
    const jwt = require("jsonwebtoken");
    let isUser = false;

    const userName = req.body.userName;
    const password = req.body.password;

    let email, phoneNumber, roleID;
    let accessToken;

    User.findOne({ where: { user_name: userName } })
        .then((user) => {
            if (bcrypt.compareSync(password, user.password)) {
                roleID = user.roleId;
                email = user.email;
                phoneNumber = user.phone_number;

                accessToken = jwt.sign(
                    { id: user.id },
                    "SECRET_CODE",
                    {
                        algorithm: "HS256",
                        allowInsecureKeySizes: true
                    }
                );
                isUser = true;
            }
        })
        .then((data) => {
            if (isUser) {
                res.json({
                    status: "OK",
                    user_name: userName,
                    phone_number: phoneNumber,
                    email: email,
                    role: roleID,
                    token: accessToken
                });
            }
        })
        .catch((err) => {
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

//Get Users - Start
app.get("/user/:username", findOneUser);
app.get("/user/:id", findUserById);

app.get("/users", findAllUser);

app.get("/users/:roleId", findAllUserByCondition);

app.put("/user/update/:username", updateUser);

app.delete("/user/delete/:username", deleteUser);

app.delete("/user/delete", deleteAllUser);
// Get Users - End


// Login user - Start
app.post("/login", login);
// Login user - End

//


// Room Controller - Start
async function createRoom(req, res, next) {
    const Room = db.room;
    const roomNumber = req.body.roomNumber;
    const floorNumber = req.body.floorNumber;
    const roomPrice = req.body.roomPrice;

    if (!roomNumber || !floorNumber) {
        res.json({ msg: "Room Number and Floor Number Cannot be Empty!" });
        return;
    }


    let roomData = {
        room_number: roomNumber,
        floorId: floorNumber,
        room_price: roomPrice
    }

    Room.create(roomData)
        .then((d) => {
            res.json({ msg: "Room Created Successfully!" });
        })
        .catch((e) => {
            res.json({ msg: "Cannot Create Room!" });
        })
};


async function getRoomById(req, res) {
    const Room = db.room;
    const roomId = req.params.id;

    Room.findByPk(roomId)
        .then((room) => {
            res.json({ msg: "Room Found!", roomNumber: room.room_number, roomFloor: room.floorId, available: room.avail });
        })
        .catch((err) => {
            res.json({ msg: "Room not found!" });
        })
}


async function getRooms(req, res) {
    const Room = db.room;
    let roomData = [];
    Room.findAll()
        .then((rooms) => {
            rooms.forEach(element => {
                roomData.push({
                    roomNumber: element.room_number,
                    roomPrice: element.room_price,
                    available: element.avail == 1 ? "Yes" : "No",
                    floorNumber: element.floorId,
                });
            });
            res.send(roomData);
        })
        .catch((err) => {
            res.json({ Error: err.message });
        })
}

async function destroyRoomById(req, res) {
    const Room = db.room;
    const roomId = req.params.id;

    Room.destroy({
        where: {
            id: roomId
        }
    })
        .then((d) => {
            res.json({ msg: "Room destroyed successfully!", status: "OK" });
        })
        .catch((err) => {
            res.json({ msg: "Cannot Destroy Room!" });
        });
}


async function destroyRoom(req, res) {
    const Room = db.room;
    Room.destroy()
        .then((d) => {
            res.json({ msg: "Room destroyed successfully!", status: "OK" });
        })
        .catch((err) => {
            res.json({ msg: "Cannot Destroy Room!" });
        });
}


async function updateRoom(req, res) {
    const Room = db.room;
    const roomId = req.params.id;

    let roomData = {
        room_number: req.body.roomNumber,
        avail: req.body.available,
        floor_number: req.body.floorNumber
    }

    Room.update(roomData, {
        where: {
            id: roomId
        }
    })
        .then(() => {
            res.json({ msg: "Room Updated Successfully", update: roomData });
        })
        .catch((err) => {
            res.json({ msg: "Error " + err.message });
        })
}
// Rooms Controller - End

// Rooms Router - Start
app.post("/room/create", createRoom);
app.get("/room/:id", getRoomById);
app.get("/rooms", getRooms);
app.delete("/room/delete/:id", destroyRoomById);
app.delete("/room/delete", destroyRoom);
app.put("/room/update/:id", updateRoom);
// Rooms Router - End

// Facility Controller - Start
async function createFacility(req, res, next) {
    const Facility = db.facility;
    const itemName = req.body.item

    if (!itemName) {
        res.json({ msg: "Item Cannot be Empty!" });
        return;
    }

    let facilityData = {
        item: itemName
    };

    Facility.create(facilityData)
        .then((d) => {
            res.json({ msg: "Facility Created Successfully!", status: "OK" });
        })
        .catch((e) => {
            res.json({ msg: "Cannot Create Facility!" });
        });
};


async function getFacilityById(req, res) {
    const Facility = db.facility;
    const facilityId = req.params.id;

    Facility.findByPk(facilityId)
        .then((facility) => {
            res.json({ msg: "Item Found!", itemName: facility.item });
        })
        .catch((err) => {
            res.json({ msg: "Item not found!" });
        })
}


async function getFacility(req, res) {
    const Facility = db.facility;
    let facilityData = [];
    Facility.findAll()
        .then((facilities) => {
            facilities.forEach(element => {
                facilityData.push({
                    itemName: element.item
                });
            });
            res.json({ roomData });
        })
        .catch((err) => {
            res.json({ Error: err.message });
        })
}

async function destroyFacilityById(req, res) {
    const Facility = db.facility;
    const facilityId = req.params.id;

    Room.destroy({
        where: {
            id: facilityId
        }
    })
        .then((d) => {
            res.json({ msg: "Facility destroyed successfully!", status: "OK" });
        })
        .catch((err) => {
            res.json({ msg: "Cannot Destroy Facility!" });
        });
}


async function destroyFacility(req, res) {
    const Facility = db.facility;
    Facility.destroy()
        .then((d) => {
            res.json({ msg: "Facility destroyed successfully!", status: "OK" });
        })
        .catch((err) => {
            res.json({ msg: "Cannot Destroy Facility!" });
        });
}


async function updateFacility(req, res) {
    const Facility = db.facility;
    const facilityId = req.params.id;

    let facilityData = {
        item: req.body.itemName,
    };

    Facility.update(facilityData, {
        where: {
            id: facilityId
        }
    })
        .then(() => {
            res.json({ msg: "Facility Updated Successfully", update: facilityData });
        })
        .catch((err) => {
            res.json({ msg: "Error " + err.message });
        })
}
// Facility Controller - End

// Facility Router - Start
app.post("/facility/create", createFacility);
app.get("/facility/:id", getFacilityById);
app.get("/facilities", getFacility);
app.delete("/facility/delete/:id", destroyFacilityById);
app.delete("/facility/delete", destroyFacility);
app.put("/facility/update/:id", updateFacility);
// facility Router - End

// Payment Proof Controller - start

// Saving image of room - Start
const multer = require("multer");
const path = require("path");
const diskStorage = multer.diskStorage({
    // Save to destinate folder
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "./uploads/payment-proof/"));
    },
    // Save to folder with custom filename
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + req.params.username.toString().replace(" ", "").trim() + "_" + "paid" + path.extname(file.originalname));
    },
});


async function saveImageToDB(req, res, next) {
    const Proof = db.proof;
    const User = db.user;
    const username = req.params.username;

    if (!username) {
        return;
    }
    // const fileName =username+".jpg";
    const imagePath = path.join(__dirname, ("/uploads/payment-proof/" + "payment-proof_" + username + "_paid.jpg"));

    User.findOne({ where: { user_name: username } })
        .then((user) => {
            Proof.create({
                image_path: imagePath,
                userId: user.id
            })
                .then(() => {
                    next();
                })
                .catch(err => {
                    res.json({ msg: "Cannot save image!" + err.message });
                })
        })

}
// Saving image of room - end


async function acceptFile(req, res) {
    res.json({ msg: "Upload Success!", status: "OK" });
}

async function getPaymentProof(req, res) {
    const Proof = db.proof;
    const User = db.user;
    const userName = req.params.username;
    // const userName = req.body.userName;
    // const phoneNumber = req.body.phoneNumber;

    User.findOne({
        where: {
            user_name: userName,
            // phone_number: phoneNumber
        }
    })
        .then((user) => {
            Proof.findOne({
                where: {
                    userId: user.id
                }
            })
                .then((proof) => {
                    const fileName = proof.image_path;
                    res.sendFile(fileName);
                })
                .catch((err) => {
                    res.json({ msg: "No Payment Proof Found!" })
                })
        })
        .catch((err) => {
            res.json({ msg: "User Not Found!" });
        })

}

async function verifyPaymentProof(req, res) {
    const Room = db.room;
    const User = db.user;
    const Rent = db.rent;
    const Notif = db.notif;

    const userName = req.body.userName;
    const roomNumber = req.body.roomNumber;
    const floorNumber = req.body.floorNumber;
    //Using 0 1 value to verify

    User.findOne({ where: { user_name: userName } })
        .then((user) => {
            Room.findOne({ where: { room_number: roomNumber, floorId: floorNumber } })
                .then((room) => {
                    Rent.findOne({ where: { roomId: room.id } })
                        .then(async (rent) => {
                            await rent.update({ is_verified: 1 }, { where: { roomId: room.id } })
                            await room.update({ avail: 0, userId: user.id }, { where: { id: room.id } })
                            Notif.create({
                                title: "Masa Tenggat",
                                content: "Silahkan Perpanjang Masa Sewa Kos Anda",
                                userId: user.id,
                                roomId: room.id,
                                rentId: rent.id
                            })
                                .then(() => {
                                    res.json({ msg: "Payment has been verified", status: "OK" });
                                })
                                .catch(() => {
                                    res.json({ msg: "Cannot create notification", status: "failed" });
                                })
                        })
                })
        })

}
// Payment Proof Controller - end


// Payment Proof Routes - Start

//Saving payment proof to folder
app.put("/room/payment/proof/:username", multer({ storage: diskStorage }).single("payment-proof"), saveImageToDB, acceptFile);
// app.put("/room/payment/proof/:username", saveImageToDB, acceptProof);
//Saving end

// For admin to get the payment proof picture
app.get("/room/payment/proof/user/:username", getPaymentProof);
// For admin to verify user payment
app.put("/room/payment/proof/user/verify", verifyPaymentProof);

// Payment Proof Routes - End


// User Rent Room Controller - Start
function setDate(date) {
    return new Date(Date.now() + (date * 24 * 60 * 60 * 1000));
}

function dateLinkFormater(date) {
    const format = date.toISOString().slice(0, 10);

    return format;
}
async function selectRoomToRent(req, res) {
    const Rent = db.rent;
    const Room = db.room;
    const User = db.user;

    const userName = req.body.userName;
    const roomNumber = req.body.roomNumber;
    const floorNumber = parseInt(req.body.floorNumber);

    Room.findOne({
        where: {
            room_number: roomNumber,
            floorId: floorNumber
        }
    })
        .then((room) => {
            User.findOne({
                where: {
                    user_name: userName,
                }
            })
                .then((user) => {

                    let date = new Date();

                    Rent.upsert({
                        start_date: (dateLinkFormater(setDate(0))).toString(),
                        end_date: (dateLinkFormater(setDate(30))).toString(),
                        paid: 1,
                        roomId: room.id,
                        userId: user.id
                    }, { where: { roomId: room.id, userId: user.id } })
                        .then(() => {
                            res.json({ msg: "Room Selected Successfully", status: "OK" });
                        })
                        .catch((err) => {
                            res.json({ msg: "Can't Select Room to Rent!", status: "failed" });
                        })

                })
                .catch((err) => {
                    res.json({ msg: "Cannot find user", error: err.message });
                })

        })
        .catch((error) => {
            res.json({ msg: "Cant Find Room!" });
        });

}

async function getSelectedRoom(req, res) {
    const Room = db.room;
    const User = db.user;
    const Rent = db.rent;

    const userID = req.params.userId;
    const roomID = req.params.roomId;

    Rent.finOne({ where: { userId: userID } })
        .then(async (selected) => {
            const user = await User.findOne({ where: { userId: userID } });
            const room = await Room.findOne({ where: { roomId: roomID } });

            res.json({
                user_name: user.user_name,
                room_number: room.room_number,
                floor_number: room.floorId,
                room_price: room.room_price,
                paid: selected["paid"],
                is_verified: selected["is_verified"],
                start_date: selected["start_date"],
                end_date: selected["end_data"]
            });
        })
        .catch((err) => {

        });

}

//TODO: Get All RENTS for Admin Langganan
async function getAllSelectedRoom(req, res) {
    const Rent = db.rent;
    const User = db.user;
    const Room = db.room;

    Rent.findAll({
        include: [
            {
                model: User,
                attributes: ["user_name"]
            },
            {
                model: Room,
                attributes: ["room_number", "floorId", "room_price"]

            }

        ]
    })
        .then((rents) => {
            res.send(rents);
        })
        .catch((err) => {
            res.send([]);
        });
}

async function getAllSelectedRoomByCondition(req, res) {
    const User = db.user;
    const Room = db.room;
    const Rent = db.rent;
    const username = req.params.userName;
    console.log(username);

    User.findOne({ where: { user_name: username } })
        .then((user) => {
            Rent.findAll({
                where: { userId: user.id },
                include: [
                    {
                        model: User,
                        attributes: ["user_name"]
                    },
                    {
                        model: Room,
                        attributes: ["room_number", "floorId", "room_price"]
                    }
                ]
            })
                .then((rents) => {
                    res.send(rents);
                })
                .catch((err) => {
                    res.json({ msg: "Cannot find rent!", status: "empty", error: err.message });
                })
        })
        .catch((err) => {
            res.json({ msg: "Cannot find user!", status: "empty", error: err.message });
        });
}

async function allRent(rents) {
    let value = [];

    rents.forEach((n) => {
        const dueDate = calculateDueFromMils(n.end_date);
        if (n["is_verified"] < 1) { console.log("paid", n["paid"], "is_verified", n["is_verified"]); return; };
        value.push({
            "username": n.user["user_name"],
            "start_date": n["start_date"],
            "end_date": n["end_date"],
            "due": dueDate.toString(),
            "paid": n["paid"],
            "verified": n["is_verified"],
            "room_number": n.room["room_number"],
            "floor_number": n.room["floorId"].toString(),
            "room_price": n.room["room_price"]
        })



    });
    return value;
}
async function getAllUserRents(req, res) {
    const Rent = db.rent;
    const User = db.user;
    const Room = db.room;

    Rent.findAll({
        include: [
            {
                model: User,
                attributes: ["user_name"]
            },
            {
                model: Room,
                attributes: ["room_number", "floorId", "room_price"]

            }

        ]
    })
        .then((rents) => {
            allRent(rents).then((value) => {
                res.send(value);
            })
        })
        .catch((err) => {
            resfalse.send([]);
        });
}

async function getAllUserRentsByCondition(req, res) {
    const Rent = db.rent;
    const User = db.user;
    const Room = db.room;

    const username = req.params.username;
    User.findOne({ where: { user_name: username } })
        .then((user) => {
            Rent.findAll({
                where: { userId: user.id },
                include: [
                    {
                        model: User,
                        attributes: ["user_name"]
                    },
                    {
                        model: Room,
                        attributes: ["room_number", "floorId", "room_price"]

                    }

                ]
            })
                .then((rents) => {
                    allRent(rents).then((value) => {
                        res.send(value);
                    })
                })
                .catch((err) => {
                    res.send([]);
                });
        });
}

function addEndDate(endDate, add) {
    const m1 = new Date(endDate)
    const m2 = new Date((add * 1000 * 60 * 60 * 24));
    const result = m1.getTime() + m2.getTime();

    return new Date(result).toISOString().slice(0, 10);
}
async function updateRent(req, res) {
    const User = db.user;
    const Rent = db.rent;
    const Room = db.room;

    try {
        const username = req.body.userName;
        const roomNumber = req.body.roomNumber;
        const floorNumber = req.body.floorNumber;
        const add = parseInt(req.body.addDue);
        console.log(add);
        const user = await User.findOne({ where: { user_name: username } });
        const room = await Room.findOne({ where: { room_number: roomNumber, floorId: floorNumber } });
        const rent = await Rent.findOne({ where: { userId: user.id, roomId: room.id } });
        rent.update({ end_date: addEndDate(rent.end_date, add) }, { where: { id: rent.id } })
            .then((r) => {
                res.json({ msg: "Date updated successfully", status: "OK" });
            })
            .catch((err)=>{
                res.json({ msg: "Date failed to update", status: "OK", error: err.message });
            })
    }
    catch (err) {
        res.json({ msg: "Date failed to update", status: "failed", error: err.message });
    }
}

async function deleteRent(req, res) {
    const Room = db.room;
    const User = db.user;
    const Rent = db.rent;

    const username = req.params.username;
    const roomnumber = req.params.roomnumber;
    const floornumber = req.params.floornumber;

    User.findOne({ where: { user_name: username } })
        .then((user) => {
            Room.findOne({ where: { room_number: roomnumber, floorId: floornumber } })
                .then( async (room) => {
                    await room.update({avail: 1, userId: null}, {where:{userId: user.id}})
                    Rent.destroy({ where: { userId: user.id, roomId: room.id } })
                        .then((rent) => {
                            console.log(rent);
                            res.json({ msg: "Rent Deleted succesfully", status: "OK" })
                        })
                })

        })
        .catch((err) => {
            res.json({ msg: "Cannot delete rent", status: "failed", error: err.message });
        })

}

// Rent controllers - End

// Rent routes - Start
app.post("/rent/room", selectRoomToRent);
app.get("/rent/:roomId/:userId", getSelectedRoom);
app.get("/rents", getAllSelectedRoom);
app.get("/rent/users", getAllUserRents);
app.get("/rent/all/user/:username", getAllUserRentsByCondition);
app.get("/rents/:userName", getAllSelectedRoomByCondition);
app.put("/rent/update/", updateRent);
app.delete("/rent/delete/:roomnumber/:floornumber/:username", deleteRent);
// Rent routes - End


// Notification Controller - Start


// function formatISOtoUTC(ISOStringDate) {
//     const isoDate = new Date(ISOStringDate);
//     const year = isoDate.getUTCYear(isoDate);
//     const month = isoDate.getUTCMonth(isoDate);
//     const date = isoDate.getUTCDate(isoDate);

//     const fullDate = `${date}/${month}/${year}`
//     return fullDate;
// }

// function getDueDate(startDate, endDate) {
//     const datentime = require("date-and-time");

//     const start = startDate.split("-")
//     const startYear = start[0];
//     const startMonth = start[1];
//     const sDate = start[2];

//     const end = endDate.split("-")
//     const endYear = end[0];
//     const endMonth = end[1];
//     const eDate = end[2];

//     return parseInt(datentime.subtract(
//         new Date(endYear, endMonth, eDate),
//         new Date(startYear, startMonth, sDate))
//         .toDays() - 1).toString();
// }

function calculateDueFromMils(isoString) {
    const dueDay = (new Date(isoString) - Date.now()) / 86_400_000;
    return Math.ceil(dueDay);
}
async function formatAllNotif(notifs, role) {
    let newNotifs = [];
    notifs.forEach((n) => {
        const dueDate = calculateDueFromMils(n.rent["end_date"]);
        if (dueDate > 5) return;
        newNotifs.push({
            "id": n.id,
            "username": n.user["user_name"],
            "title": n.title,
            "content": n.content,
            "is_read": n.is_read > 0 ? "1" : "0",
            "start_date": n.rent["start_date"],
            "end_date": n.rent["end_date"],
            "due": dueDate.toString(),
            "paid": n.rent["paid"] > 0 ? "1" : "0",
            "verified": n.rent["is_verified"] > 0 ? "1" : 0,
            "room_number": n.room["room_number"],
            "floor_number": n.room["floorId"].toString()
        })
    })
    return newNotifs;
}

async function readNotif(req, res) {
    const notifId = req.params.notifId;
    try {
        await Notif.update({ is_read: 1 }, { where: { id: notifId } });
        res.json({ msg: "Notif is read!", status: "OK" });
    }
    catch (err) {
        res.json({ msg: "Cannot read Notif!", status: "failed" });
    }
}

async function getAllNotification(req, res) {
    const Notif = db.notif;
    Notif.findAll()
        .then((notifs) => {
            formatAllNotif(notifs)
                .then((value) => {
                    res.send(value);
                });
        })
        .catch((err) => {
            res.send([]);
            // res.json({ msg: "Cannot get notification!", status: "empty" });
        });
}

async function getAllUserNotificationByCondition(req, res) {
    const Notif = db.notif;
    const User = db.user;
    const Rent = db.rent;
    const Room = db.room;
    const username = req.params.username;

    try {
        User.findOne({ where: { user_name: username } })
            .then((user) => {
                Notif.findAll({
                    where: { userId: user.id },
                    include: [
                        {
                            model: User,
                            attributes: ["user_name", "roomId"],
                        },
                        {
                            model: Rent,
                            attributes: ["start_date", "end_date", "paid", "is_verified",],
                        },
                        {
                            model: Room,
                            attributes: ["room_number", "floorId"]
                        }
                    ],
                })
                    .then((notif) => {
                        formatAllNotif(notif)
                            .then((notifs) => {
                                res.send(notifs);
                            })
                    })
                    .catch((err) => {
                        res.send([]);
                        // res.json({ msg: "Cannot find notif", status: "empty", error: err.message });
                    });
            })
    }
    catch (err) {
        res.json({ msg: "Something Went Wrong!", status: "failed" });
    }


}
// Notification Controller - End

// Notification Routes - Start
app.get("/user/notifs", getAllNotification);
app.get("/user/notif/:username", getAllUserNotificationByCondition);
app.put("/user/notif/read/:notifId", readNotif);

// Notification Routes - End



const hostname = "0.0.0.0"
app.listen(port, hostname, () => {
    console.log("Host: " + hostname + " Server listening in port,", port);
})

