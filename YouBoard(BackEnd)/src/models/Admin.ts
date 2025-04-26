import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
}

const adminSchema: Schema = new Schema(
  {
    email: { type: String, required: false },
    password: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("Admin", adminSchema);
