const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const RegisterUser = require('./model')
const middleware = require('./middleware')

const app = express();

mongoose.connect('mongodb+srv://ashok:ashok@cluster0.0pygyzv.mongodb.net/?retryWrites=true&w=majority').then(
    ()=>{
        console.log("DB connected")
    }
)
.catch(err => console.log(err,"DB connection error"))

app.use(express.json());

app.use(cors({
    origin:'*'
}))

app.get('/',(req,res)=>{
    res.send("Hello World!");
})

app.post('/registerUser',async (req,res)=>{
    try{
        let {username,email,password,confirmPassword} = req.body
        let newUser = new RegisterUser({
            username:username,
            email:email,
            password:password,
            confirmPassword:confirmPassword
        })
        const exist = await RegisterUser.findOne({email:email});
        if(exist){
            return res.json("user already existed");
        }
        if(password !== confirmPassword){
            return res.json("paswords are not matched");
        }
        await newUser.save();
        return res.json("Registered Successfully")
        
    }
    catch(err){
        console.log(err,"registerUser api is not working");
        return res.status(500).send("Internal server error");
    }

})

app.post('/login',async(req,res)=>{
    try{
        let {email,password} = req.body;
        let exist = await RegisterUser.findOne({email:email});
        if(!exist){
            return res.json("Email Id is not valid");
        }
        if(exist.password !== password){
            return res.json("Invalid creditinals");
        }

        let payload = {
            user:{
                id:exist.id
            }
        }

        jwt.sign(payload,"ashok",{expiresIn:3600000},
        (err,token)=>{
            if(err) throw err;
            return res.json({token})
        })
    }catch(err){
        console.log("error in login api");
        return res.status(500).send("Internal server error");
    }
})

app.get('/myprofile',middleware,async(req,res)=>{
    try{
        // console.log(req.user,"user");
        let exist = await RegisterUser.findById(req.user.id);

        if(!exist){
            return req.status(400).send('User not found');
        }

        return res.json(exist)
    }
    catch(err){
        console.log(err,"myprofile api have the error");
        return res.status(500).send("internal server error");
    }
})

app.listen('5000',()=>{
    console.log("Server started....");
})