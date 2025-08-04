import { ObjectId } from 'mongodb';

export interface Budget {
  _id?: ObjectId;
  name: string;
  category: string;
  amount: number;
  spent: number;
  month?: string;
  isRecurring: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isDeleted: boolean;
}
