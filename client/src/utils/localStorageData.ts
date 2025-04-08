import { openDB, DBSchema } from 'idb';
import { v4 as uuidv4 } from 'uuid';

// Define history file interface
export interface HistoryFile {
  id?: number;
  createdAt?: string;
  uuid?: string;
  cid: string;
  type: string;
  fileName: string,
  fileSize: string,
  status: string,
  progress: number,
  shareableLink: string,
  errorMessage: string,
}

// Define default empty data
export const DEFAULT_DATA: MySpaceData = {
  historyfiles: []
};

// Define data type interface
export interface MySpaceData {
  historyfiles: HistoryFile[];
}

// Define database schema
interface MySpaceDBSchema extends DBSchema {
  myfiledrop: {
    key: string;
    value: MySpaceData;
  };
}

const DB_NAME = 'myfiledrop-db';
const STORE_NAME = 'myfiledrop';
const DB_VERSION = 1; 

// Initialize IndexedDB
const initDB = async () => {
  try {
    const db = await openDB<MySpaceDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          console.log("Creating object store:", STORE_NAME);
          db.createObjectStore(STORE_NAME);
        }
      },
    });
    console.log("Database initialized successfully");
    return db;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

// Get data from IndexedDB
export const getMySpaceData = async (): Promise<MySpaceData> => {
  try {
    const db = await initDB();
    const data = await db.get(STORE_NAME, 'data');
    console.log("Retrieved data from IDB:", data);
    if (!data) {
      console.log("No data found, returning default data");
      await setMySpaceData(DEFAULT_DATA);
      return DEFAULT_DATA;
    }
    return data;
  } catch (error) {
    console.error("Error getting MySpace data:", error);
    return DEFAULT_DATA;
  }
};

// Save data to IndexedDB
export const setMySpaceData = async (data: MySpaceData): Promise<void> => {
  try {
    const db = await initDB();
    await db.put(STORE_NAME, data, 'data');
  } catch (error) {
    console.error("Error setting MySpace data:", error);
  }
};

// Add a history file
export const addHistoryFile = async (item: HistoryFile): Promise<void> => {
  try {
    const currentData = await getMySpaceData();
    const itemWithUuid = {
      ...item,
      id: parseInt(uuidv4().replace(/-/g, '').slice(0, 8), 16),
      uuid: uuidv4(),
      createdAt: new Date().toISOString()
    };
    currentData.historyfiles.unshift(itemWithUuid);
    await setMySpaceData(currentData);
  } catch (error) {
    console.error(`Error adding history file:`, error);
  }
};


// Remove a history file by ID
export const removeHistoryFile = async (itemId: number): Promise<void> => {
  try {
    const currentData = await getMySpaceData();
    currentData.historyfiles = currentData.historyfiles.filter(item => item.id !== itemId);
    await setMySpaceData(currentData);
  } catch (error) {
    console.error(`Error removing history file:`, error);
  }
};

// Get all history files
export const getHistoryFiles = async (): Promise<HistoryFile[]> => {
  try {
    const data = await getMySpaceData();
    return data.historyfiles;
  } catch (error) {
    console.error(`Error getting history files:`, error);
    return [];
  }
};

// Clear all MySpace data
export const clearAllMySpaceData = async (): Promise<void> => {
  try {
    const db = await initDB();
    await db.clear(STORE_NAME);
    await setMySpaceData(DEFAULT_DATA);
  } catch (error) {
    console.error("Error clearing MySpace data:", error);
  }
}; 