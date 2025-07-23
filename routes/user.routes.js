const express = require('express')
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')




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
})

router.get('/login',(req, res)=>{
    res.render('login')
})
router.post('/login',
    body('username').trim().isLength({min: 3}),
    body('password').trim().isLength({min: 5}),
    async (req, res)=>{

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                error: errors.array(),
                message: 'Invalid Data !!'
            })
        }

        const { username, password } = req.body;
        const user = await userModel.findOne({
            username: username
        })

        if(!user){
            return res.status(400).json({
                message: 'Username or password is incorrect !!'
            })
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({
                message: 'Username or password is incorrect !!'
            })
        }
        // now create a jsonwebtoken

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            username: user.username
        },
            process.env.JWT_SECRET,
        )
        res.cookie('token',token)
        res.send('Logged In !!')
    }
)


module.exports = router;