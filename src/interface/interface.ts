import mongoose, { Document, Types } from 'mongoose';

export interface IPost extends Document {
    title: string;
    content: string;
    user: mongoose.Types.ObjectId;
}
