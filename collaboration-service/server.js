import { httpServer } from "./index.js"; // Import `httpServer` from `index.js`
import { connectToDB } from "./model/repository.js";
import "dotenv/config";

const port = process.env.PORT || 3004;

connectToDB()
  .then(() => {
    console.log("MongoDB Connected!");

    httpServer.listen(port, () => {
      console.log("Collaboration service server listening on http://collaboration-service:" + port);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB");
    console.error(err);
    process.exit(1);
  });
