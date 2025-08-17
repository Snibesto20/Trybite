// External package imports
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Type import
import type { Request, Response } from "express";

// Local module imports
import { db_userModel } from "./dbSchemas/userSchema";
import { validUsernameRegister, validPasswordRegister } from "../modules/inputValidators";

// Initialize dotenv
dotenv.config();

// Interfaces
interface JwtPayload {
  _id: string;
}

// Router
export const router = express.Router();

// Routes
router.get("/validUsernameRegister", async (req: Request, res: Response) => {
  console.log(`\n📁 /validUsernameRegister was triggered by client.`);
  const result = await validUsernameRegister(req.query.username as string)
  res.status(result.httpStatusCode).json(result.statusCodes)
})

router.get("/validPasswordRegister", async (req: Request, res: Response) => {
  console.log(`\n📁 /validPasswordRegister was triggered by client.`);
  const result = await validPasswordRegister(req.query.password as string)
  res.status(result.httpStatusCode).json(result.statusCodes)
})

router.get("/usernameAvailable", async (req: Request, res: Response) => {
  console.log(`\n📁 /usernameAvailable was triggered by client.`);
  const username = req.query.username
  const isTaken = await db_userModel.findOne({ username }).lean()

  if(isTaken) {
    console.log(`Username ${username} is already taken E002 ❌`);
    return res.status(409).json({statusCodes: ["E002"]});
  } else {
    console.log(`Username ${username} is available S005 ✅`);
    return res.status(200).json({statusCodes: ["S005"]});
  }
})

router.post("/registerUser", async (req, res) => {
  console.log(`\n📁 /registerUser was triggered by client.`);
  const { username, password } = req.body;

  // Validating username
  const usernameRes = await validUsernameRegister(username)
  // Validating password
  const passwordRes = await validPasswordRegister(password)

  // If the submit is correct create the account
  if(usernameRes.statusCodes.includes("S005") && passwordRes.statusCodes.includes("S006")) { 
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS))
    const newUser =  new db_userModel({username, password: hashedPassword})
    
    const jwtToken = jwt.sign({_id: newUser._id} as JwtPayload, process.env.JWT_SECRET as string)
    try {
      await newUser.save()
      console.log(`📦 New user @${username} created!`);
      console.log(`📂 Sent response to client.`);
      return res.status(201).json({ 
        statusCodes: ["S002"], 
        jwtToken 
      });
    } catch (err: unknown) {
      console.log(`❌ Error occurred when trying to create new user:`, err);
      return res.status(500).json({statusCodes: ["E009"]})
    }

}

  // If the submit is incorrect decline the account creation
  else {
    console.log(`📦 Invalid client data!`);
    console.log(`📂 Sent response to client.`);
    return res.status(400).json({ statusCodes: ["E011"] });
  }
});