import mongoose, { Document, Schema } from 'mongoose';

export interface AdminDocument extends Document {
  username: string;
  password: string;
}

const adminSchema = new Schema<AdminDocument>({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export default mongoose.model<AdminDocument>('Admin', adminSchema);
