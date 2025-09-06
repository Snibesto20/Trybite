export const StatusMsg = Object.freeze({
  // Username errors
  E001: "Usernames can only contain a-zA-Z0-9_-",
  E002: "Username is already taken!",
  E004: "Username must be 3-20 characters long!",

  // Password errors
  E010: "Password must be 8-64 characters long!",

  // Server errors
  E009: "An unexpected error occurred, try again later!",

  // Login errors
  E012: "Username or password is incorrect!",

  // Malformed request
  E011: "The client request was malformed!",

  // Validation success messages
  S005: "Valid username!",
  S006: "Valid password!",
  S007: "Successfully changed the username!"
});
