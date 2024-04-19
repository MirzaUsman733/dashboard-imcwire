import mongoose from "mongoose";

const { Schema } = mongoose;

const ResponsesDataUser = new Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      unique: false,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    selectedTitle: {
      type: String,
      required: true,
    },
    article: {
      type: String,
      require: true,
    },
    totalTokensUsed: {
      type: Number,
      default: 0,
    },
    currentTime: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

export default mongoose.models.ResponsesDataUser || mongoose.model("ResponsesDataUser", ResponsesDataUser);
