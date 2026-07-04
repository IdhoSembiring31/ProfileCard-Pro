import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Alert, Linking } from 'react-native';

export const usePermissions = () => {
  // --- KAMERA ---
  const ensureCameraPermission = async () => {
    const { status } = await ImagePicker.getCameraPermissionsAsync();
    
    if (status === 'granted') return true;
    
    if (status === 'denied') {
      showDeniedAlert('Kamera', 'Kamera diperlukan untuk mengambil foto profil.');
      return false;
    }

    // Status 'undetermined' → priming + request
    return new Promise((resolve) => {
      Alert.alert(
        '📸 Butuh Akses Kamera',
        'Kami membutuhkan kamera agar Anda bisa mengambil foto profil langsung. Foto hanya tersimpan di perangkat Anda.',
        [
          { text: 'Batal', style: 'cancel', onPress: () => resolve(false) },
          {
            text: 'Lanjutkan',
            onPress: async () => {
              const result = await ImagePicker.requestCameraPermissionsAsync();
              if (result.status === 'granted') {
                resolve(true);
              } else {
                showDeniedAlert('Kamera', 'Aktifkan akses kamera di Pengaturan untuk menggunakan fitur ini.');
                resolve(false);
              }
            }
          }
        ]
      );
    });
  };

  // --- GALERI ---
  const ensureGalleryPermission = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    
    if (status === 'granted') return true;
    
    if (status === 'denied') {
      showDeniedAlert('Galeri', 'Galeri diperlukan untuk memilih foto dari perpustakaan Anda.');
      return false;
    }

    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.status === 'granted') {
      return true;
    } else {
      showDeniedAlert('Galeri', 'Aktifkan akses galeri di Pengaturan.');
      return false;
    }
  };

  // --- LOKASI GPS ---
  const ensureLocationPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    
    if (status === 'granted') return true;
    
    if (status === 'denied') {
      showDeniedAlert('Lokasi', 'Lokasi diperlukan untuk menampilkan koordinat Anda.');
      return false;
    }

    const result = await Location.requestForegroundPermissionsAsync();
    if (result.status === 'granted') {
      return true;
    } else {
      showDeniedAlert('Lokasi', 'Aktifkan akses lokasi di Pengaturan.');
      return false;
    }
  };

  // --- Helper: Alert Penolakan dengan Tombol Settings ---
  const showDeniedAlert = (fitur, pesan) => {
    Alert.alert(
      `⛔ Akses ${fitur} Ditolak`,
      pesan,
      [
        { text: 'OK', style: 'default' },
        {
          text: '⚙️ Buka Pengaturan',
          onPress: () => Linking.openSettings()
        }
      ]
    );
  };

  return {
    ensureCameraPermission,
    ensureGalleryPermission,
    ensureLocationPermission,
  };
};