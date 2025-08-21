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

// Interface/type imports
import { JwtPayload } from "../types";

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

router.post("/registerUser", async (req: Request, res: Response) => {
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
    
    try {
      await newUser.save()
      console.log(`📦 New user @${username} created!`);
      console.log(`📂 Sent response to client.`);
      return res.status(200).json({ 
        statusCodes: ["S002"], 
        jwtToken: jwt.sign({_id: newUser._id} as JwtPayload, process.env.JWT_SECRET as string) 
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

router.post("/loginUser", async (req: Request, res: Response) => {
  console.log(`\n📁 /loginUser was triggered by client.`);
  const { username, password } = req.body;
  
  try {
    const foundUser = await db_userModel.findOne({username}).lean()
    
    // If user by the passed in credentials is not found
    if(!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
      console.log(`📦 Invalid client data!`);
      console.log(`📂 Sent response to client.`);
      return res.status(400).json({ statusCodes: ["E012"] });
    }

    // If user by the passed in credentials is found
    console.log(`📦 User @${username} successfully logged in!`);
    console.log(`📂 Sent response to client.`);
    return res.status(201).json({ 
      statusCodes: ["S003"], 
      jwtToken: jwt.sign({_id: foundUser._id} as JwtPayload, process.env.JWT_SECRET as string)
    });
  }

  // On unexpected client/server errors errors.
  catch (err: unknown) {
    console.log(`❌ Error occurred when trying to login:`, err);
    return res.status(500).json({statusCodes: ["E009"]})
  }
});

router.get("/fetchAccount", async (req, res) => {
  console.log(`\n📁 /registerUser was triggered by client.`);
  const authHeader = req.headers["authorization"];
  const clientJwt = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null

  if(!clientJwt) {
    console.log(`📦 JWT token doesn't exist. E008`);
    console.log(`📂 Sent response to client.`);
    return res.status(401).json({ statusCodes: ["E009"] });
  }

  try {
    const decodedJWT = jwt.verify(clientJwt, process.env.JWT_SECRET as string) as JwtPayload;
    const fetchedAccount = await db_userModel.findOne({ _id: decodedJWT._id }).select("-password -__v").lean()
    console.log(`📦 Valid JWT token.`);
    console.log(`📂 Sent response to client.`);
    return res.status(200).json({ fetchedAccount, statusCodes: ["S001"] })
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(`📦 JWT verification failed: ${err.message}`);
    } else {
      console.log(`📦 JWT verification failed:`, err);
    }
    console.log(`📂 Sent response to client.`);
    return res.status(401).json({ statusCodes: ["E008"] });
  }
})
