import mongoose, { Document, Schema } from 'mongoose';

export interface IBoard extends Document {
  name: string;
}

const BoardSchema: Schema = new Schema({
  name: { type: String, required: true },
});

export default mongoose.models.Board || mongoose.model<IBoard>('Board', BoardSchema);
