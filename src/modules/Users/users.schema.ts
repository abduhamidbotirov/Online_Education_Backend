import mongoose, { Document, Schema } from 'mongoose';

export interface UserDocument extends Document {
  fullname: string;
  email: string;
  password?: string; 
}

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const userSchema = new Schema<UserDocument>({
  fullname: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, // Email maydoni unique bo'lishi kerak
    match: [emailRegex, 'Invalid email format'], // Email formatini tekshirish
  },
  password: { type: String },
}); 

export default mongoose.model<UserDocument>('User', userSchema);
