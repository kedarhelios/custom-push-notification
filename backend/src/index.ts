import app from "./app";
import { Server } from "http";

let server: Server;
server = app.listen(8000, () => {
  console.log(`Listening to port ${8000}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: any) => {
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  if (server) {
    server.close();
  }
});
