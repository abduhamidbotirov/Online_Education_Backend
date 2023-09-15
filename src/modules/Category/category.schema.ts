import mongoose, { Document, Schema } from 'mongoose';
import { ICategory } from '../../interface/interface';
const categorySchema = new Schema<ICategory>(
    {
        catName: {
            type: String,
            required: true,
        },
        videosId: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Video',
                required: true,
            },
        ],
    },
    {
        timestamps: true,
    }
);
categorySchema.set('toObject', {
    transform: function (doc: Document, ret: any) {
        ret._id = ret._id.toString();
    },
});
// Create and export the Category model
export default mongoose.model<ICategory>('Category', categorySchema);