import crypto from "crypto";
import { prisma } from "./prisma.js";

const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 30 * 1000;
const MAX_ATTEMPTS = 5;

const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");

export class OtpCooldownError extends Error {
    constructor(waitSeconds) {
        super(`Please wait ${waitSeconds}s before requesting another code`);
        this.name = "OtpCooldownError";
    }
}

// One active OTP row per phone (upserted), hashed at rest, single-use,
// rate-limited on both resend and verification attempts.
export const generateAndStoreOtp = async (phone) => {
    const existing = await prisma.otpRequest.findUnique({ where: { phone } });
    if (existing) {
        const cooldownRemaining = existing.createdAt.getTime() + RESEND_COOLDOWN_MS - Date.now();
        if (cooldownRemaining > 0) {
            throw new OtpCooldownError(Math.ceil(cooldownRemaining / 1000));
        }
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);

    await prisma.otpRequest.upsert({
        where: { phone },
        create: { phone, otpHash, expiresAt },
        update: { otpHash, expiresAt, attempts: 0, createdAt: new Date() },
    });

    return otp;
};

// Checks the OTP without consuming it, since the new-user signup flow needs
// to verify the same OTP twice (once to detect the account doesn't exist
// yet, again after the name step). Call consumeOtp() once the flow
// actually completes (existing-user login, or new-user account creation).
export const verifyOtp = async (phone, otp) => {
    const entry = await prisma.otpRequest.findUnique({ where: { phone } });
    if (!entry) return false;

    if (Date.now() > entry.expiresAt.getTime()) {
        await prisma.otpRequest.delete({ where: { phone } }).catch(() => {});
        return false;
    }

    if (entry.attempts >= MAX_ATTEMPTS) {
        await prisma.otpRequest.delete({ where: { phone } }).catch(() => {});
        return false;
    }

    if (entry.otpHash === hashOtp(otp)) {
        return true;
    }

    const attempts = entry.attempts + 1;
    if (attempts >= MAX_ATTEMPTS) {
        await prisma.otpRequest.delete({ where: { phone } }).catch(() => {});
    } else {
        await prisma.otpRequest.update({ where: { phone }, data: { attempts } });
    }
    return false;
};

export const consumeOtp = async (phone) => {
    await prisma.otpRequest.delete({ where: { phone } }).catch(() => {});
};
