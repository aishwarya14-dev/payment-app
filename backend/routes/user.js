const express = require("express");
const {authMiddleware} = require('../middleware');
const app = express();

const PORT = 3000;
const jwt = require('jsonwebtoken');
const router = express.Router();
const zod = require('zod');
const { User, Account} = require('../db');
const JWT_SECRET = require("../config");

const schemaObject = zod.object({
    username  : zod.string(),
    password : zod.string(),
    firstName : zod.string(),
    lastName : zod.string()
});

router.post('/sign-up',async function(req,res,next){
    const body = req.body;
    const {success} = schemaObject.safeParse(body);
    if(!success){
        return res.status(411).json({
            message : "Email already taken / Incorrect inputs"
        })
    }

    const existingUser = User.findOne({
        username : body.username
    });

    if(existingUser){
        return res.status(411).json({
            message : "Email already taken / Incorrect inputs"
        })
    }

    const dbUser = await User.create(body);
    const userId = dbUser._id;

    await Account.create({
        userId : userId,
        balance :  1 + Math.random() * 10000
    })

    const token = jwt.sign({
        userId : dbUser._id
    },JWT_SECRET);

    res.json({
        message : "User created successfully",
        token : token
    })
})

router.post('/sign-in',async function(req,res,next){
    const body = req.body;
    const {success} = schemaObject.safeParse(body);
    
    if(!success){
       return res.status(411).json({
        message : "Invalid email or password"
       });
    }
    
    const user = User.findOne({
        username : req.body.username,
        password : req.body.password
    });

    if(user){
        const token = jwt.sign({
            userId: user._id
        },JWT_SECRET);

       return res.json({
            token : token
        });
    }

    return res.status(411).json({
        message : "error while logging in"
    })
});

const updateData = zod.object({
    password : zod.string().optional(),
    firstName : zod.string().optional(),
    lastName : zod.string().optional()
});

router.put("/update-user",authMiddleware, async (req,res)=>{
    const {success} = updateData.safeParse(req.body);

    if(!success){
       return res.status(411).json({
            message : "Error while updating information"
        });
    }

    await User.updateOne(req.body,{
        id : req.userId
    })

    return res.json({
        message : "Updated successfully"
    })
});

router.get("/bulk",async (req,res)=> {
    
    const filter = req.query.filter || "";
    const users = await User.find({
        "$or" : [
            {
                firstName : {
                    "$regex" : filter
                }
            },
            {
                lastName : {
                    "$regex" : filter
                }
            }
        ]
    })
    res.json({
        user : users.map(
            user => ({
                username : user.username,
                firstName : suer.firstName,
                lastName : user.lastName,
                _id : user._id
            })
        )
    })
})

module.exports = router;


// doubts - all mongodb methods