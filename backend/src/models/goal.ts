import { ObjectId } from 'mongodb';

export interface Goal {
  _id?: ObjectId;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isDeleted: boolean;
}
