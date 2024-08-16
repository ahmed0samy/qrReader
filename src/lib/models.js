import mongoose from "mongoose";

const product = new mongoose.Schema(
  {
    name: String,
    amount: Number,
    code: { type: String, unique: true },
    img: String,
    price: Number,
  },
  { timestamps: true }
);

const operation = new mongoose.Schema(
  {
    type: Number, // 1 Sell, 2 Buy
    accountId: String,
    products: [{ code: String, count: Number }],
  },
  { timestamps: true }
);

// export const User = mongoose.models?.User || mongoose.model("User", userSchema);
export const Operation =
  mongoose.models?.Operations || mongoose.model("Operations", operation);
export const Product =
  mongoose.models?.Products || mongoose.model("Products", product);
