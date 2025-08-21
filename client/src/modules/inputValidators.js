// External imports
import axios from "axios"

// Essential variables declaration
const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;

export async function validUsernameRegister(username) {
    // Check for username length
    if (!username || username.length < 3 || username.length > 20) {
    console.error(`❌ Invalid client data: username! E004`);
    return {state: "error", message: "Username must be 3-20 characters long."}
  }

  // Check for username regex
  if (!usernameRegex.test(username)) {
    console.error(`❌ Invalid client data: username! E001`);
    return {state: "error", message: "Usernames can only contain a-zA-Z0-9_-"}
  }

  // Check is username is available
  let statusCodes
  try {
      statusCodes = (await axios.get("http://localhost:5000/usernameAvailable", {params: {username}})).data.statusCodes
  }
  catch(err) {
      if (err.response.data?.statusCodes?.includes("E002")) {
        console.error(`❌ Invalid client data: username! E002`);
        return {state: "error", message: "Usernames is already taken!"}
      }
  }

  // If resource is validated successfully
  console.log(`✅ Valid client data: username! S005`);
  return {state: "neutral", message: ""}
}

export function validPasswordRegister(password) {
    // Check for password length
    if (!password || password.length < 8 || password.length > 64) {
    console.error(`❌ Invalid client data: password! E010`);
    return {state: "error", message: "Password must be 8-64 characters long."}
  }

  // If resource is validated successfully
  console.log(`✅ Valid client data! S006`);
  return {state: "neutral", message: ""}
}