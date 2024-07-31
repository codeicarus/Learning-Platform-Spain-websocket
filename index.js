const connectDB = require("./db/conn");
const {
  userConnected,
  io,
  serverHTTP,
  userLogout,
  clientDisconnected,
  clientConectedTwo,
  checkUserConectedToSocket,
  checkReconection,
  chaneUserPassword,
} = require("./handlers/Handlers");

connectDB();

io.on("connection", (socket) => {
  socket.on("user-connected", (data) => userConnected(data, socket));
  socket.on("close-other-sessions", (data) => clientConectedTwo(data, socket));
  socket.on("checkUserConectedToSocket", (data) =>
    checkUserConectedToSocket(data, socket)
  );
  socket.on("user-disconnected", (data) => userLogout(data));
  socket.on("disconnect", () => clientDisconnected(socket));

  socket.on("check-reconection", (data) => checkReconection(data, socket));

  socket.on("change-password-user", (data) => chaneUserPassword(socket, data));
});

serverHTTP.listen(8081, () =>
  console.log("ServerSocket ready => http://localhost:8081")
);
