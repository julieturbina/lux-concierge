const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const procedureSchema = new Schema({
  title: String,
  provider: String,
  review: String,
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Procedure = mongoose.model("Procedure", procedureSchema);

module.exports = Procedure;