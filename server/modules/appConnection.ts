import { Express } from "express";

export function appConnect(app: Express) {
  try {
    app.listen(5000, () => {
      console.log(
        `✅ Successfully hosted the app on port http://localhost:5000!`,
      );
    });
  } catch (error) {
    console.log(`❌ Failed to start the app! Error: ${error}`);
  }
}
