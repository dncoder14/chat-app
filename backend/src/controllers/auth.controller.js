import { generateToken } from "../lib/utils.js";
import { prisma } from "../lib/prisma.js";
import { consumeOtp, generateAndStoreOtp, OtpCooldownError, verifyOtp as checkOtp } from "../lib/otpStore.js";
import { cloudinary } from "../lib/cloudinary.js";

const E164_REGEX = /^\+[1-9]\d{6,14}$/;

// Generates and "sends" an OTP for a phone number. There's no real SMS
// vendor wired in yet, so the OTP is echoed back in the response (dev only)
// for the frontend to display directly. Swap this for a real vendor call
// (e.g. 2Factor) later and drop the `otp` field from the response.
export const sendOtp = async (req, res) => {
    const { phone } = req.body;
    try {
        if (!phone || !E164_REGEX.test(phone)) {
            return res.status(400).json({ message: "A valid phone number is required" });
        }

        const otp = await generateAndStoreOtp(phone);

        res.status(200).json({
            message: "OTP sent",
            ...(process.env.NODE_ENV !== "production" && { otp }),
        });
    } catch (error) {
        if (error instanceof OtpCooldownError) {
            return res.status(429).json({ message: error.message });
        }
        console.log("Error in sendOtp controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const verifyOtp = async (req, res) => {
    const { phone, otp, fullName } = req.body;
    try {
        if (!phone || !otp) {
            return res.status(400).json({ message: "Phone and OTP are required" });
        }

        if (!(await checkOtp(phone, otp))) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        let user = await prisma.user.findUnique({ where: { phone } });

        if (!user) {
            if (!fullName || !fullName.trim()) {
                return res.status(200).json({ newUser: true });
            }

            user = await prisma.user.create({
                data: { phone, fullName: fullName.trim() },
            });
        }

        await consumeOtp(phone);

        await prisma.user.update({
            where: { id: user.id },
            data: { isOnline: true },
        });

        const token = generateToken(user.id, res);

        res.status(200).json({
            _id: user.id,
            fullName: user.fullName,
            phone: user.phone,
            profilePic: user.profilePic,
            token,
        });
    } catch (error) {
        console.log("Error in verifyOtp controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

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
