import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";

export const registerUser = async (data) => {
  const hashedPassword = await bcrypt.hash(
    data.password,
    10
  );

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword
    }
  });

  return user;
};