/**
 * Tests for Realm configuration
 * Tests local database setup with encryption
 */
import { getRealm, closeRealm } from '../../config/realm';

// Mock Realm
jest.mock('realm', () => {
  const mockOpen = jest.fn().mockImplementation(config => {
    // Check for encryption key
    if (config.encryptionKey) {
      return Promise.resolve({
        isClosed: false,
        close: jest.fn(),
        objects: jest.fn().mockReturnValue({
          filtered: jest.fn().mockReturnValue([])
        })
      });
    } else {
      return Promise.reject(new Error('Missing encryption key'));
    }
  });
  
  return {
    open: mockOpen
  };
});

// Mock encryption utility
jest.mock('../../utils/encryption', () => ({
  getEncryptionKey: jest.fn().mockReturnValue(new Uint8Array(64))
}));

describe('Realm Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    closeRealm();
  });

  test('should open Realm with encryption', async () => {
    const realm = await getRealm();
    
    // Realm should be created
    expect(realm).toBeDefined();
    expect(realm.isClosed).toBe(false);
    
    // Realm.open should be called with encryption key
    const Realm = require('realm');
    expect(Realm.open).toHaveBeenCalled();
    
    const openArgs = Realm.open.mock.calls[0][0];
    expect(openArgs).toHaveProperty('encryptionKey');
    expect(openArgs).toHaveProperty('schema');
    expect(openArgs).toHaveProperty('schemaVersion');
  });

  test('should reuse existing Realm connection', async () => {
    // Get Realm twice
    const realm1 = await getRealm();
    const realm2 = await getRealm();
    
    // Should be the same instance
    expect(realm1).toBe(realm2);
    
    // Realm.open should only be called once
    const Realm = require('realm');
    expect(Realm.open).toHaveBeenCalledTimes(1);
  });

  test('should close Realm connection', async () => {
    // First get Realm to initialize
    const realm = await getRealm();
    const closeSpy = jest.spyOn(realm, 'close');
    
    // Then close
    closeRealm();
    
    // Close should be called
    expect(closeSpy).toHaveBeenCalled();
  });
});
