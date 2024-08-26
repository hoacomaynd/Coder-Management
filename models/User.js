const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true,unique: true },
  role: {
    type: String,
    enum: ["employee", "manager"],
    default: "employee"
  },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
