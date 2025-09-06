// Local module imports
import { db_userModel } from "./dbSchemas/userSchema";

// Essential variables declaration
const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
const passwordRegex = /^[\p{L}\p{N}\p{P}\p{S}]{8,64}$/u;

export async function validUsernameRegister(username: string) {
  // Check for username length
  if (!username || username.length < 3 || username.length > 20) {
    return { httpStatusCode: 400, statusCodes: ["E004"] };
  }

  // Check for username regex
  if (!usernameRegex.test(username)) {
    return { httpStatusCode: 400, statusCodes: ["E001"] };
  }

  // Check if username already exists
  try {
    const userFound = await db_userModel.findOne({ username });
    if (userFound) {
      return { httpStatusCode: 409, statusCodes: ["E002"] };
    } else {
      // If username passed all checks
      return { httpStatusCode: 200, statusCodes: ["S005"] };
    }
  } catch (err) {
    return { httpStatusCode: 500, statusCodes: ["E009"] };
  }
}

export function validPasswordRegister(password: string) {
  // Check for password length
  if (!password || password.length < 8 || password.length > 64) {
    return { httpStatusCode: 400, statusCodes: ["E010"] };
  }

  // Check for password regex
  if (!passwordRegex.test(password)) {
    return { httpStatusCode: 400, statusCodes: ["E005"] };
  }

  // If password passed all checks
  return { httpStatusCode: 200, statusCodes: ["S006"] };
}
