import User from "../models/User.js";


const registerUser = async(req, res) => {
    try {
        const createUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })

        return res.status(201).json({
            message:'Register Success!',
            data:createUser
        })
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

const getUser = (req, res) => {
    res.send('Get User');
}

export {registerUser, loginUser, logoutUser, getUser}