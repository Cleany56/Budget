import { ObjectId } from 'mongodb';

export interface Budget {
  _id?: string; // Changed from ObjectId to string to match Realm schema
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
