import express from 'express';
import User from './../models/User.js';
import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config.js';
import fetchUser from '../middleWare/fetchUser.js';

const router = express.Router();

//Signup endpoint
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body//Destructure data from body
    try {

        //Details validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" })
        }

        //Email validation
        if (!email.includes('@')) {
            return res.status(400).json({ error: "Invalid email" })
        }

        //unique user with email
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ error: "User Already exist" })
        }

        //Generate salt
        const salt = await bycrypt.genSalt(10)

        //Hash Password
        const hashedPassword = await bycrypt.hash(password, salt)

        //Save data into database
        const newUser = await User({
            name,
            email,
            password: hashedPassword
        })

        await newUser.save()
        console.log(newUser)

        res.status(200).json({ success: "Signup successful" })

    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

//Login endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        if (!email || !password) {
            res.status(400).json({ error: "All fields required" })
        }

        //Email validation
        if (!email.includes('@')) {
            res.status(400).json({ error: "Invalid email" })
        }

        const user = await User.findOne({ email });

        console.log(user)

        if (!user) {
            return res.status(400).json({ error: "User Already exist" })
        }

        const doMatch = await bycrypt.compare(password, user.password)
        console.log(doMatch)

        //if password matches then generate a token
        if (doMatch) {
            const token = jwt.sign({ userId: user.id }, "" + process.env.JWT_SECRET, {
                expiresIn: '7d'
            })

            res.status(201).json({ token, success: "Login successful" })
        }
        else {
            res.status(404).json({ error: 'Email And Password Not Found' })
        }


    } catch (error) {
        console.log(error)
    }

})

//get user endpoint
router.get('/getuser', fetchUser, async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

export default router