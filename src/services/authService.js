import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import dotenv from "dotenv";
import { generateToken, verifyToken, generateRefreshToken } from "../utils/jwt.js";

dotenv.config();

async function registerUser(info){
    const user = await prisma.user.create({
      data: {
        email: info.email,
        password: await bcrypt.hash(info.password, 10),
        name: info.name
      }
    })
    return user;
}

async function findUserByEmail(email) {
  const user = await prisma.user.findUnique({
    where: {
      email: email
    }
  });
  return user;
}

async function loginUser(info) {
  const user = await findUserByEmail(info.email);
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordValid = await bcrypt.compare(info.password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };

  const token = generateToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const { password, ...userDetails } = user;
  return {
    token,
    refreshToken,
    userDetails,
  };
}

async function getUserDetails(token) {
    const payload = verifyToken(token);
    const user = await findUserByEmail(payload.email);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
}

async function refreshToken(refreshTokenValue) {
  try {
    const user = verifyToken(refreshTokenValue, process.env.JWT_REFRESH_SECRET);
    const newToken = generateToken(user);
    return {
      token: newToken,
    };
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
}

export { registerUser, findUserByEmail, loginUser, getUserDetails, refreshToken };