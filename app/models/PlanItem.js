import mongoose, { model, models, Schema } from "mongoose";

const PlanItemSchema = new Schema({
  planName: {type: String},
  priceSingle: { type: Number },
  totalPlanPrice: { type: Number },
  planDescription: {type: String},
  pdfLink: { type: String },
}, {
  versionKey: false,
  timestamps: true,
});

export const PlansItems = models?.PlansItems || model('PlansItems', PlanItemSchema);