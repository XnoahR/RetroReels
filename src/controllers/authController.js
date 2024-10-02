import User from "../models/User.js";
import jwt from "jsonwebtoken"

const signToken = id => {
    return jwt.sign({id}, process.env.SECRET_KEY, {
        expiresIn: '1d'
    });
}

const createSendToken = (user, status, res) => {
    const token = signToken(user._id);
    const cookieOption = {
        expire: new Date(
            Date.now() + 24 * 60 * 60 * 1000 //hour, minute, second, milisecond
        ),
        httpOnly: true,
        security: false
    }

    res.cookie('jwt', token, cookieOption); //assign name , value, option
    user.password = undefined;
    res.status(status).json({
        data:user
    })
}

const registerUser = async(req, res) => {
    try {
        const createUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })

        // return res.status(201).json({
        //     message:'Register Success!',
        //     data:createUser
        // })
        createSendToken(createUser, 201, res)
    } catch (error) {
        return res.status(400).json(error.message)
    }
}

const loginUser = (req, res) => {
    res.send('Login User');
}

const logoutUser = (req, res) => {
    res.send('Logout User');
}

const getUser = async (req, res) => {
    const users = await User.find();
    try {
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export {registerUser, loginUser, logoutUser, getUser}