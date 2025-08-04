/**
 * Tests for data synchronization between Realm and MongoDB
 */
import { manualSync } from '../../config/sync';
import { getRealm } from '../../config/realm';
import { getDatabase } from '../../config/mongodb';

// Mock Realm
jest.mock('../../config/realm', () => {
  const mockObjects = jest.fn().mockReturnValue({
    filtered: jest.fn().mockReturnValue([
      { _id: 'account1', balance: 1000, name: 'Checking', userId: 'user123' },
      { _id: 'account2', balance: 5000, name: 'Savings', userId: 'user123' }
    ])
  });
  
  return {
    getRealm: jest.fn().mockResolvedValue({
      objects: mockObjects
    }),
    closeRealm: jest.fn()
  };
});

// Mock MongoDB
jest.mock('../../config/mongodb', () => {
  const mockUpdateOne = jest.fn().mockResolvedValue({ modifiedCount: 1 });
  const mockCollection = jest.fn().mockReturnValue({
    updateOne: mockUpdateOne
  });
  
  return {
    getDatabase: jest.fn().mockResolvedValue({
      collection: mockCollection
    }),
    closeMongoClient: jest.fn().mockResolvedValue(undefined)
  };
});

describe('Data Synchronization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should sync accounts from Realm to MongoDB', async () => {
    const userId = 'user123';
    await manualSync(userId);
    
    // Realm should be queried
    const realm = await getRealm();
    expect(realm.objects).toHaveBeenCalledWith('Account');
    expect(realm.objects('Account').filtered).toHaveBeenCalledWith('userId == $0', userId);
    
    // MongoDB should be updated
    const db = await getDatabase();
    expect(db.collection).toHaveBeenCalledWith('accounts');
    
    // Each account should be synchronized
    const accountsCollection = db.collection('accounts');
    
    // Since we're using jest.fn() for mocks, we can safely cast to access mock data
    const mockUpdateOne = accountsCollection.updateOne as jest.Mock;
    const firstUpdateCall = mockUpdateOne.mock.calls[0];
    
    expect(firstUpdateCall[0]).toEqual({ _id: 'account1' });
    expect(firstUpdateCall[1].$set).toHaveProperty('balance', 1000);
    expect(firstUpdateCall[1].$set).toHaveProperty('name', 'Checking');
    expect(firstUpdateCall[1].$set).toHaveProperty('userId', 'user123');
    expect(firstUpdateCall[2]).toEqual({ upsert: true });
  });

  test('should sync transactions from Realm to MongoDB', async () => {
    // Mock transactions
    const mockRealmObjects = getRealm as jest.Mock;
    mockRealmObjects.mockImplementation(() => ({
      objects: (collection: string) => {
        if (collection === 'Transaction') {
          return {
            filtered: () => [
              { _id: 'tx1', amount: 50, title: 'Groceries', userId: 'user123' },
              { _id: 'tx2', amount: 25, title: 'Gas', userId: 'user123' }
            ]
          };
        }
        return { filtered: () => [] };
      }
    }));
    
    const userId = 'user123';
    await manualSync(userId);
    
    // MongoDB should be updated
    const db = await getDatabase();
    expect(db.collection).toHaveBeenCalledWith('transactions');
    
    // Each transaction should be synchronized
    const txCollection = db.collection('transactions');
    
    // Cast to jest.Mock to access mock data
    const mockTxUpdate = txCollection.updateOne as jest.Mock;
    const firstTxUpdate = mockTxUpdate.mock.calls[0];
    
    expect(firstTxUpdate[0]).toEqual({ _id: 'tx1' });
    expect(firstTxUpdate[1].$set).toHaveProperty('amount', 50);
    expect(firstTxUpdate[1].$set).toHaveProperty('title', 'Groceries');
  });
});
