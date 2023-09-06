import mongoose, { Document, Types } from 'mongoose';
export interface IPost extends Document {
    title: string;
    content: string;
    user: mongoose.Types.ObjectId;
}
export interface ICategory extends Document {
    catName: string;
    videosId?: Types.ObjectId[] | Array<Types.ObjectId>;
}