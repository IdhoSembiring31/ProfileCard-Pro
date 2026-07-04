import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@profile_data';

export const saveProfileData = async (data) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Gagal menyimpan:', e);
  }
};

export const loadProfileData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Gagal memuat:', e);
    return null;
  }
};

export const clearProfileData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Gagal menghapus:', e);
  }
};