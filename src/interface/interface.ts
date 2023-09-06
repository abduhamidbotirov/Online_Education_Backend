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
export interface IVideo extends Document {
    vd_Link: string;
    vd_Img: string;
    vd_Title: string;
    vd_moreInfoId: Types.ObjectId[] | Array<Types.ObjectId>;
    vd_commentId: Types.ObjectId[] | Array<Types.ObjectId>;
}
