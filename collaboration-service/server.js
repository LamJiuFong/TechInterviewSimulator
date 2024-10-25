import http from "http";
import index from "./index.js";
import "dotenv/config";

const port = process.env.PORT || 3004;

const server = http.createServer(index);

server.listen(port);

