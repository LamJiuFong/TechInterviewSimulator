import { app } from "./index.js";
import http from "http";
import "dotenv";

const server = http.createServer(app);

server.listen(process.env.PORT)
