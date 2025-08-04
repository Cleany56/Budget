import { ObjectId } from 'mongodb';

export interface Transaction {
  _id?: ObjectId;
  title: string;
  amount: number;
  date: Date;
  category: string;
  notes?: string;
  accountId?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
