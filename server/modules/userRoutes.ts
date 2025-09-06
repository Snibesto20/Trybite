// External package imports
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Type import
import type { Request, Response } from "express";

// Local module imports
import { db_userModel } from "./dbSchemas/userSchema";
import {
  validUsernameRegister,
  validPasswordRegister,
} from "../modules/inputValidators";

// Initialize dotenv
dotenv.config();

// Interface/type imports
import { JwtPayload } from "../types";

// Router
export const router = express.Router();

// Routes
router.get("/validUsernameRegister", async (req: Request, res: Response) => {
  console.log(`\n📁 /validUsernameRegister was triggered by client.`);

  if (!req.query.username || Array.isArray(req.query.username)) {
    return res.status(400).json({ statusCodes: ["E011"] });
  }

  try {
    const result = await validUsernameRegister(req.query.username as string);
    res.status(result.httpStatusCode).json(result.statusCodes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ statusCodes: ["E009"] });
  }
});

router.get("/validPasswordRegister", async (req: Request, res: Response) => {
  console.log(`\n📁 /validPasswordRegister was triggered by client.`);

  if (!req.query.password || Array.isArray(req.query.password)) {
    return res.status(400).json({ statusCodes: ["E011"] });
  }

  try {
    const result = await validPasswordRegister(req.query.password as string);
    res.status(result.httpStatusCode).json(result.statusCodes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ statusCodes: ["E009"] });
  }
});

router.get("/usernameAvailable", async (req: Request, res: Response) => {
  console.log(`\n📁 /usernameAvailable was triggered by client.`);

  if (!req.query.username || Array.isArray(req.query.username)) {
    return res.status(400).json({ statusCodes: ["E011"] });
  }

  const username = (req.query.username as string).toLowerCase();

  try {
    const isTaken = await db_userModel.findOne({ username }).lean();

    if (isTaken) {
      console.log(`Username ${username} is already taken E002 ❌`);
      return res.status(409).json({ statusCodes: ["E002"] });
    } else {
      console.log(`Username ${username} is available S005 ✅`);
      return res.status(200).json({ statusCodes: ["S005"] });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ statusCodes: ["E009"] });
  }
});

router.post("/registerUser", async (req: Request, res: Response) => {
  console.log(`\n📁 /registerUser was triggered by client.`);
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ statusCodes: ["E011"] });

  try {
    const usernameRes = await validUsernameRegister(username.toLowerCase());
    const passwordRes = await validPasswordRegister(password);

    if (usernameRes.statusCodes.includes("S005") && passwordRes.statusCodes.includes("S006")) {
      const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
      const user = new db_userModel({
        username: username.toLowerCase(),
        displayName: username,
        password: hashedPassword,
      });

      await user.save();
      console.log(`📦 New user @${username} created!`);
      return res.status(201).json({
        statusCodes: ["S002"],
        jwtToken: jwt.sign({ _id: user._id } as JwtPayload, process.env.JWT_SECRET as string),
      });
    } else {
      console.log(`📦 Invalid client data!`);
      return res.status(400).json({ statusCodes: [...usernameRes.statusCodes, ...passwordRes.statusCodes] });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ statusCodes: ["E009"] });
  }
});

router.post("/loginUser", async (req: Request, res: Response) => {
  console.log(`\n📁 /loginUser was triggered by client.`);
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ statusCodes: ["E011"] });

  try {
    const user = await db_userModel.findOne({ username: username.toLowerCase() }).lean();
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log(`📦 Invalid client data!`);
      return res.status(401).json({ statusCodes: ["E012"] });
    }

    console.log(`📦 User @${username} successfully logged in!`);
    return res.status(200).json({
      statusCodes: ["S003"],
      jwtToken: jwt.sign({ _id: user._id } as JwtPayload, process.env.JWT_SECRET as string),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ statusCodes: ["E009"] });
  }
});

router.get("/fetchAccount", async (req: Request, res: Response) => {
  console.log(`\n📁 /fetchAccount was triggered by client.`);

  const authHeader = req.headers["authorization"];
  const clientJwt = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!clientJwt) return res.status(401).json({ statusCodes: ["E008"] });

  try {
    const decodedJWT = jwt.verify(clientJwt, process.env.JWT_SECRET as string) as JwtPayload;
    const fetchedAccount = await db_userModel
      .findOne({ _id: decodedJWT._id })
      .select("-password -__v")
      .lean();

    console.log(`📦 Valid JWT token.`);
    return res.status(200).json({ fetchedAccount, statusCodes: ["S004"] });
  } catch (err) {
    console.error(err);
    res.status(401).json({ statusCodes: ["E008"] });
  }
});

router.patch("/changeUsername", async (req: Request, res: Response) => {
  console.log(`\n📁 /changeUsername was triggered by client.`);

  if (!req.body?.username) return res.status(400).json({ statusCodes: ["E011"] });

  const username = req.body.username.toLowerCase();

  try {
    const usernameValid = await validUsernameRegister(username);
    if (!usernameValid.statusCodes.includes("S005")) {
      return res.status(usernameValid.httpStatusCode).json({ statusCodes: usernameValid.statusCodes });
    }

    const usernameTaken = await db_userModel.findOne({ username }).lean();
    if (usernameTaken) return res.status(409).json({ statusCodes: ["E002"] });

    const authHeader = req.headers["authorization"];
    const clientJwt = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!clientJwt) return res.status(401).json({ statusCodes: ["E008"] });

    let decodedJWT: JwtPayload;
    try {
      decodedJWT = jwt.verify(clientJwt, process.env.JWT_SECRET as string) as JwtPayload;
    } catch {
      return res.status(401).json({ statusCodes: ["E008"] });
    }

    const user = await db_userModel.findOne({ _id: decodedJWT._id });
    if (!user) return res.status(404).json({ statusCodes: ["E003"] });

    user.username = username;
    await user.save();
    return res.status(200).json({ statusCodes: ["S007"] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ statusCodes: ["E009"] });
  }
});
