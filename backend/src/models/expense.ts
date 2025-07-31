import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  title: string;
  amount: number;
  date: Date;
  category: string;
  notes?: string;
  userId: string; // For future user authentication
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    category: { type: String, required: true },
    notes: { type: String },
    userId: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IExpense>('Expense', ExpenseSchema);
