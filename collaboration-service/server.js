import http from "http";
import index from "./index.js";
import { Server } from "socket.io"
import { connectToDB } from "./model/repository.js";
import "dotenv/config";
import collaborationSocket from "./sockets/collaborationSocket.js";

const port = process.env.PORT || 3004;

const httpServer = http.createServer(index);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3002",
    methods: ["GET", "POST"],
  },
  // path: "/collaboration-service/socket.io/",
});

collaborationSocket(io);

await connectToDB().then(() => {
  console.log("MongoDB Connected!");

  httpServer.listen(port);
  console.log("Collaboration service server listening on http://localhost:" + port);
}).catch((err) => {
  console.error("Failed to connect to DB");
  console.error(err);
});

