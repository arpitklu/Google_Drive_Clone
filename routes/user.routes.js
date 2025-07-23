const express = require('express')
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.model')
const bcrypt = require('bcrypt');


router.get('/test',(req,res)=>{
    res.send('User Test Route');
})

router.get('/register',(req, res)=>{
    res.render('register')
})

router.post('/register',
    body('email').trim().isEmail().isLength({min: 13}),
    body('password').trim().isLength({min: 5}),
    body('username').trim().isLength({min: 3}),
    async (req,res)=>{

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array(),
            message: "Invalid Data!!" 
        })
    }
    
    const {email, username, password } = req.body;

    const hashPassword = await bcrypt.hash(password,10)    //here 10 represents 10 rounds of hashing the password !!

    const newUser = await userModel.create({
        email,
        username,
        password: hashPassword
        
    })
    res.json(newUser)

    // console.log(req.body)
    // res.send('User Registered !!')
})

// router.post('/register')

module.exports = router;