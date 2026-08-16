import jwt from "jsonwebtoken";

export const generateToken = (userId, res, remember = true) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: remember ? '7d' : '1d',
    });

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    };

    // Persistent cookie when "remember me" is on, session cookie (cleared
    // when the browser closes) when it's off. The JWT's own shorter
    // expiry is the safety net if the browser keeps the session alive anyway.
    if (remember) {
        cookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    }

    res.cookie("jwt", token, cookieOptions);
    return token;
}
