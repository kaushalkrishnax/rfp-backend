import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config({ path: "./.env" });

import { connectDB } from "./db/index.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(
        `⚙️  Server is running at port : ${process.env.PORT || 8000}`
      );
    });
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT),
      });
    }
    app.on("error", (error) => {
      console.error("Server failed to listen :: ", error);
      throw error;
    });
  })
  .catch((error) => console.error("MONGODB Connection Failed :: ", error));
