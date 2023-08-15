import {Schema, model, Document} from 'mongoose';

interface IPosts extends Document {
    _id: string
    posts: string[]
}


const PostsSchema: Schema<IPosts> = new Schema({
    _id: { type: String, unique: true },
    posts: [{ type: String }],
});


export const Posts = model<IPosts>('Posts', PostsSchema);
