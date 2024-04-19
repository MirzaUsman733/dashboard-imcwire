import mongoose from "mongoose";

const { Schema } = mongoose;

const compaignDataSchema = new Schema(
  {
    clientId: {
      type: String,
      required: true,
      unique: true,
    },
    // formData: {
    //   type: {
    //     address: String,
    //     companyName: String,
    //     email: String,
    //     name: String,
    //     phone: String,
    //     websiteUrl: String,
    //   },
    //   unique: false,
    //   required: false,
    // },
    formDataSignUp: {
      type: {
        email: String,
        name: String,
      },
      unique: false,
      required: false,
    },
    matchedPlanData: {
      type: {
        createdAt: Date,
        pdfLink: String,
        planDescription: String,
        planName: String,
        priceSingle: Number,
        totalPlanPrice: Number,
        updatedAt: Date,
      },
      unique: false,
      required: false,
    },
    selectedCategories: {
      type: [{ name: String, price: Number }],
      unique: false,
      required: false,
    },
    selectedCountries: {
      type: [{ name: String, price: Number }],
      unique: false,
      required: false,
    },
    selectedCountryTranslations: {
      type: [{ name: String, price: Number }],
      unique: false,
      required: false,
    },
    selectedPrice: {
      type: Number,
      unique: false,
      required: false,
    },
    cost: {
      type: Number,
      unique: false,
      required: false,
    },
    categorySubtotal: {
      type: Number,
      unique: false,
      required: false,
    },
    countrySubTotal: {
      type: Number,
      unique: false,
      required: false,
    },
    countryTranslationsPrice: {
      type: Number,
      unique: false,
      required: false,
    },
    totalPrice: {
      type: Number,
      unique: false,
      required: false,
    },
    selectedOption: {
      type: String,
      unique: false,
      required: false,
    },
    status: {
      type: String,
      default: "unpaid",
      required: true,
    },
    action: {
      type: String,
      default: "pending",
      required: true,
    },
    isAgency: {
      type: Boolean,
      require: false,
      unique: false,
    },
    agencyName: {
      type: String,
      require: true,
      unique: false,
    },
    currentTime: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const CompaignData =
  mongoose.models.compaignData ||
  mongoose.model("compaignData", compaignDataSchema);
export default CompaignData;
