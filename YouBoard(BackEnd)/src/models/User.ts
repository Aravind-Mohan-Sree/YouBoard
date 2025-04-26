import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  imageUrl: string;
  isBlocked: boolean;
}

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imageUrl: { type: String, required: false, default: "" },
    isBlocked: { type: Boolean, required: false, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
