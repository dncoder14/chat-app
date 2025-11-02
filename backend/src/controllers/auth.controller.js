import { generateToken } from "../lib/utils.js";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { cloudinary } from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, email, phone, password } = req.body;
    try {
        if (!fullName || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Phone validation
        const phoneRegex = /^[+]?[1-9]\d{1,14}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            return res.status(400).json({ message: "Invalid phone number format" });
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { phone }]
            }
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email or phone already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                fullName,
                email,
                phone,
                password: hashedPassword
            }
        });

        generateToken(newUser.id, res);

        const token = generateToken(newUser.id, res);
        
        res.status(201).json({
            _id: newUser.id,
            fullName: newUser.fullName,
            email: newUser.email,
            phone: newUser.phone,
            profilePic: newUser.profilePic,
            token
        });
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        await prisma.user.update({
            where: { id: user.id },
            data: { isOnline: true }
        });
        const token = generateToken(user.id, res);

        res.status(200).json({
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            profilePic: user.profilePic,
            token
        });

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = async (req, res) => {
    try {
        if (req.user?.id) {
            await prisma.user.update({
                where: { id: req.user.id },
                data: { 
                    isOnline: false, 
                    lastSeen: new Date() 
                }
            });
        }
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user.id;

        if (!profilePic) return res.status(400).json({ message: "Profile picture is required" });

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { profilePic: uploadResponse.secure_url },
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                profilePic: true
            }
        });

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("error in update profile:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}