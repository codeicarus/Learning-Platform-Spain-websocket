const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const app = express();
const serverHTTP = createServer(app);
const Usuarios = require("../Schema/Users");

const io = new Server(serverHTTP, {
  cors: {
    headers: "*",
  },
});

const userConnected = async (data, socket) => {
  const userResult = await Usuarios.findOne({ email: data.email });
  if (userResult.connected === "online") {
    io.to(socket.id).emit("error-login");
  } else {
    userResult.connected = "online";
    userResult.socket_id = socket.id;
    console.log("userResult", userResult)
    await userResult.save();
  }
};

const chaneUserPassword = async (socket, data) => {
  const userResult = await Usuarios.findById(data.id);
  io.to(userResult.socket_id).emit("change-password");
  userResult.connected = "offline";
  userResult.socket_id = "";
  await userResult.save();
};

const clientConectedTwo = async (data, socket) => {
  const userResult = await Usuarios.findOne({ email: data });
  io.to(userResult.socket_id).emit("other-user-connected");
  userResult.connected = "offline";
  userResult.socket_id = "";
  await userResult.save();
};

const checkUserConectedToSocket = async (data, socket) => {
  const userResult = await Usuarios.findOne({ email: data });
  if (userResult.socket_id !== socket.id) {
    io.to(socket.id).emit("other-user-connected");
  }
};

const userLogout = async (data) => {
  const userResult = await Usuarios.findOne({ email: data.email });
  userResult.connected = "offline";
  userResult.socket_id = "";
  const currentDate = new Date();
  const unixTimestamp = Math.floor(currentDate.getTime() / 1000);
  userResult.last_heart_beat = unixTimestamp;

  await userResult.save();
};

const clientDisconnected = async (socket) => {
  const userResult = await Usuarios.findOne({ socket_id: socket.id });
  userResult.connected = "offline";
  userResult.socket_id = "";
  const currentDate = new Date();
  const unixTimestamp = Math.floor(currentDate.getTime() / 1000);
  userResult.last_heart_beat = unixTimestamp;
  await userResult.save();
};

const checkReconection = async (data, socket) => {
  const userResult = await Usuarios.findOne({ email: data });
  if (userResult.connected === "online") {
    io.to(socket.id).emit("other-user-connected");
  } else {
    userResult.connected = "online";
    userResult.socket_id = socket.id;
    await userResult.save();
  }
};

module.exports = {
  io,
  serverHTTP,
  userConnected,
  userLogout,
  clientDisconnected,
  clientConectedTwo,
  checkUserConectedToSocket,
  checkReconection,
  chaneUserPassword,
};
