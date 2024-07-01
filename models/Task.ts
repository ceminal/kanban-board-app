import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  status: string;
  boardId: string;
  order: number;
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  boardId: { type: String, required: true },
  order: { type: Number, required: true }
});

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
