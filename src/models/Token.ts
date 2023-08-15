import { Schema, model, Document } from 'mongoose';

interface IToken extends Document {
    user: {type: string, ref: string}
    refreshToken: {type: string, required: boolean}
}

const TokenSchema: Schema<IToken> = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    refreshToken: { type: String, required: true },
});


export const Token = model('Token', TokenSchema);
