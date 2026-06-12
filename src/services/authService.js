import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";

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

export default registerUser;