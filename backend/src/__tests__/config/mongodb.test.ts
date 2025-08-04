/**
 * Tests for MongoDB configuration
 * Tests connection and client-side field level encryption
 */
import { MongoClient } from 'mongodb';
import { getMongoClient, getDatabase, closeMongoClient } from '../../config/mongodb';

// Mock MongoDB client
jest.mock('mongodb', () => {
  const mockConnect = jest.fn().mockResolvedValue(true);
  const mockClose = jest.fn().mockResolvedValue(true);
  const mockCollection = jest.fn().mockReturnValue({
    find: jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue([])
    }),
    insertOne: jest.fn().mockResolvedValue({ insertedId: 'test-id' })
  });
  const mockDb = jest.fn().mockReturnValue({
    collection: mockCollection
  });
  
  const mockMongoClient = jest.fn().mockImplementation(() => ({
    connect: mockConnect,
    close: mockClose,
    db: mockDb,
    isConnected: jest.fn().mockReturnValue(true)
  }));
  
  return {
    MongoClient: mockMongoClient
  };
});

describe('MongoDB Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await closeMongoClient();
  });

  test('should create MongoDB client with encryption config', async () => {
    const client = await getMongoClient();
    
    // Client should be created
    expect(client).toBeDefined();
    
    // MongoClient constructor should be called with encryption options
    const mockConstructor = MongoClient as unknown as jest.Mock;
    expect(mockConstructor).toHaveBeenCalled();
    
    const constructorArgs = mockConstructor.mock.calls[0][1];
    expect(constructorArgs).toHaveProperty('autoEncryption');
    expect(constructorArgs.autoEncryption).toHaveProperty('schemaMap');
    expect(constructorArgs).toHaveProperty('ssl', true);
  });

  test('should reuse existing client connection', async () => {
    // Get client twice
    const client1 = await getMongoClient();
    const client2 = await getMongoClient();
    
    // Should be the same instance
    expect(client1).toBe(client2);
    
    // Constructor should only be called once
    const mockConstructor = MongoClient as unknown as jest.Mock;
    expect(mockConstructor).toHaveBeenCalledTimes(1);
  });

  test('should get database instance', async () => {
    const db = await getDatabase();
    expect(db).toBeDefined();
    
    // Client's db method should be called
    const client = await getMongoClient();
    expect(client.db).toHaveBeenCalled();
  });

  test('should close client connection', async () => {
    // First get client to initialize
    const client = await getMongoClient();
    
    // Then close
    await closeMongoClient();
    
    // Close should be called
    expect(client.close).toHaveBeenCalled();
    
    // Getting client again should create a new instance
    await getMongoClient();
    const mockConstructor = MongoClient as unknown as jest.Mock;
    expect(mockConstructor).toHaveBeenCalledTimes(2);
  });
});
