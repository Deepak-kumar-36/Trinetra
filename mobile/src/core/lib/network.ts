import NetInfo from '@react-native-community/netinfo';
import { storage } from './storage';

export const initNetworkListener = () => {
  const unsubscribe = NetInfo.addEventListener(state => {
    console.log('Connection type', state.type);
    console.log('Is connected?', state.isConnected);
    
    // Auto-flush queue if reconnected
    if (state.isConnected) {
      flushOfflineQueue();
    }
  });

  return unsubscribe;
};

export const checkIsConnected = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected;
};

// Simplified offline queue logic
const flushOfflineQueue = async () => {
  try {
    const queueData = await storage.getItem('trinetra_offline_queue');
    if (queueData) {
      const queue = JSON.parse(queueData);
      if (queue.length > 0) {
        console.log('Flushing offline queue with', queue.length, 'items');
        // Logic to send items to Supabase goes here...
        // After sending, clear queue
        await storage.setItem('trinetra_offline_queue', JSON.stringify([]));
      }
    }
  } catch (e) {
    console.error('Failed to flush offline queue', e);
  }
};

export const queueRequest = async (endpoint: string, payload: any) => {
  try {
    const queueData = await storage.getItem('trinetra_offline_queue');
    const queue = queueData ? JSON.parse(queueData) : [];
    
    queue.push({
      id: Date.now().toString(),
      endpoint,
      payload,
      timestamp: new Date().toISOString()
    });
    
    await storage.setItem('trinetra_offline_queue', JSON.stringify(queue));
    console.log('Request queued for later due to offline status');
  } catch (e) {
    console.error('Failed to queue request', e);
  }
};
