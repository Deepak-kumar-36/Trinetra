import AsyncStorage from '@react-native-async-storage/async-storage';

// React Native safe wrapper for storage replacing Web localStorage
export const storage = {
  async setItem(key: string, value: string) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.error('Failed to save data', e);
    }
  },
  async getItem(key: string) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.error('Failed to load data', e);
      return null;
    }
  },
  async removeItem(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('Failed to remove data', e);
    }
  }
};
