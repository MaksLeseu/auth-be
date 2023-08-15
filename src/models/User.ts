import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    posts: []
}

// Created a Schema. It will describe, How our user will be stored in the database.
const UserSchema: Schema<IUser> = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },  // Поле будет строковым, уникальным, обязательным
    password: { type: String, required: true },
    posts: [{ type: String, ref: 'Posts' }]
});

// Export the model, will create from the schema
export const User = model('User', UserSchema);