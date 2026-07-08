import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

//REGISTER API
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are mandatory."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success:false,
                message: "Password must be of minimumm 8 characters."
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User exists already." 
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email, 
            password: hashedPassword
        });

        res.status(200).json({
            success: true,
            message: "User created successfully.",
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
        });
    } catch(error) {
        console.error(error); 
        res.status(500).json({
            success:false,
            message: error.message
        });
    }
};

//LOGIN API
export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Both fields are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invlaid email or password."
            });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "Invlaid email or password."
            });
        }

        res.status(200).json ({
            success:true,
            message: "Login Successful.",
            token: generateToken(user._id),
            user: {
                id:user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};