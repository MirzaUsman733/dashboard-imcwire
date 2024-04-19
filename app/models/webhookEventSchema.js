import mongoose from "mongoose";
const { Schema } = mongoose;

// Check if the model already exists before defining it
const WebhookEvent = mongoose.models.WebhookEvent || mongoose.model(
  "WebhookEvent",
  new Schema(
    {
      eventType: { type: String, unique: false, required: false }, // Use 'required' instead of 'require'
      eventData: { type: mongoose.Schema.Types.Mixed, unique: false, required: false }, // Use 'required' instead of 'require'
    },
    {
      versionKey: false,
      timestamps: true,
    }
  )
);

export default WebhookEvent;
