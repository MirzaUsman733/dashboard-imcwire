import mongoose from "mongoose";

const { Schema } = mongoose;

const AddedCompanySchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    contactName: {
      type: String,
      required: true,
    },
    address1: {
      type: String,
      required: true,
    },
    address2: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    websiteUrl: {
      type: String,
      required: true,
    },
    user: {
      type: {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
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
        role: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    currentTime: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const AddedCompany = mongoose.models.AddedCompany || mongoose.model("AddedCompany", AddedCompanySchema);

export default AddedCompany;
