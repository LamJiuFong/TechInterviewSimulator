import { httpServer } from "./index.js"; // Import `httpServer` from `index.js`
import { connectToDB } from "./model/repository.js";
import "dotenv/config";

const port = process.env.PORT || 3004;

// const dbUri = process.env.DB_URI;

// if (!dbUri) {
//   console.error("MongoDB URI is not defined in environment variables. Please set DB_URI.");
//   process.exit(1);
// }

// Connect to MongoDB and start the server
connectToDB()
  .then(() => {
    console.log("MongoDB Connected!");

    httpServer.listen(port, () => {
      console.log("Collaboration service server listening on http://localhost:" + port);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB");
    console.error(err);
    process.exit(1);
  });
