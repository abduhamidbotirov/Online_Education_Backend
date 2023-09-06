import mongoose, { Document, Schema } from 'mongoose';
import { IVideo } from '../../interface/interface';
const videoSchema = new Schema<IVideo>({
    vd_Link: {
        type: String,
        required: true,
    },
    vd_Img: {
        type: String,
        required: true,
    },
    vd_Title: {
        type: String,
        required: true,
    },
    vd_moreInfoId: [
        {
            type: Schema.Types.ObjectId,
            ref: 'MoreInfoId', // Reference to the "MoreInfoId" model/schema
        }
    ],
    vd_commentId: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment', // Reference to the "Comment" model/schema
        }
    ],
});
videoSchema.set('toObject', {
    transform: function (doc: Document, ret: any) {
        ret._id = ret._id.toString();
    },
});
videoSchema.pre<IVideo>('save', function (next) {
    this._id = this._id.toString();
    next();
});

// Create and export the Video model
export default mongoose.model<IVideo>('Video', videoSchema);