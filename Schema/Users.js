const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: String,
  socket_id: String,
  connected: String,
  last_heart_beat: Number,
});

module.exports = model("usuarios", userSchema);
