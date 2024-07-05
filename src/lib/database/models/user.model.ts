import { Schema, model, models } from "mongoose";

export interface IUser extends Document {
  clerkId: string,
  firstName: string,
  lastName: string,
  email: string,
  username: string,
  photo: string,
  planId?: number,
  creditBalance?: number
}

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  username: { type: String, required: true, unique: true},
  photo: { type: String, required: true },
  planId: { type: Number, default: 1 },
  creditBalance: { type: Number, default: 10 },
})

const User = models?.User || model('User', UserSchema)

export default User