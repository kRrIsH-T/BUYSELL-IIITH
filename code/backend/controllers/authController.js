import { response } from "express";
import user_model from "../models/user_model.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from 'jsonwebtoken';

export const registerController = async (req, res) => {
    try{
        //validations
        const {username, email, password} = req.body;
        if(!username || !email || !password){
            return res.send({error: "All fields are required"});
        }

        // Checking existing user
        const existingUser = await user_model.findOne({email});
        if(existingUser){
            return res.send({error: "User already exists"});
        }

        //Password hashing
        const hashedPassword = await hashPassword(password);

        //Saving user to database
        const user = await new user_model({username,email,password: hashedPassword}).save();

        res.send({message: "User registered successfully", user});

    } catch(error){
        console.log(error);
        res.status(500).send({error: "Error in registering user"});
    }
}

export const loginController = async (req, res) => {
    try{
        //validations
        const {email, password} = req.body;
        if(!email || !password){
            return res.send({error: "All fields are required"});
        }

        // Checking existing user
        const user = await user_model.findOne({email});
        if(!user){
            return res.send({error: "User does not exist"});
        }

        //password matching
        const match = await comparePassword(password, user.password);
        if(!match){
            return res.send({error: "Invalid credentials"});
        }

        //Generating token
        const token = JWT.sign({id: user._id}, process.env.jwtSecret, {expiresIn: "19d"});

        res.send({message: "User logged in successfully",user:{name: user.username, email: user.email}, token});

    } catch(error){
        console.log(error);
        res.status(500).send({error: "Error in logging in user"});
    }
}

export const testController = (req, res) => {
    res.send("protected route");
};
